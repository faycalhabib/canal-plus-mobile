import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:convert';
import 'package:crypto/crypto.dart';
import '../config/supabase_config.dart';

class SupabaseService {
  static SupabaseClient? _client;
  
  static SupabaseClient get client {
    if (_client == null) {
      throw Exception('Supabase not initialized. Call initialize() first.');
    }
    return _client!;
  }

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: SupabaseConfig.url,
      anonKey: SupabaseConfig.anonKey,
    );
    _client = Supabase.instance.client;
  }

  // Authentication methods (custom)
  static Future<Map<String, dynamic>> signUpWithPhone({
    required String phone,
    required String password,
    Map<String, dynamic>? data,
  }) async {
    // Normaliser le numéro de téléphone avec le préfixe +235
    String normalizedPhone = phone.replaceAll(' ', '').replaceAll('-', '');
    if (!normalizedPhone.startsWith('+235')) {
      normalizedPhone = '+235$normalizedPhone';
    }
    
    // Hasher le mot de passe
    final bytes = utf8.encode(password);
    final digest = sha256.convert(bytes);
    final passwordHash = digest.toString();
    
    // Insérer directement dans user_profiles
    final response = await client
        .from('user_profiles')
        .insert({
          'phone': normalizedPhone,
          'password_hash': passwordHash,
          'first_name': data?['first_name'] ?? '',
          'last_name': data?['last_name'] ?? '',
          'email': data?['email'],
        })
        .select()
        .single();
    
    return {
      'user': response,
      'session': null,
    };
  }

  static Future<Map<String, dynamic>> signInWithPhone({
    required String phone,
    required String password,
  }) async {
    // Normaliser le numéro de téléphone avec le préfixe +235
    String normalizedPhone = phone.replaceAll(' ', '').replaceAll('-', '');
    if (!normalizedPhone.startsWith('+235')) {
      normalizedPhone = '+235$normalizedPhone';
    }
    
    print('Numéro normalisé: $normalizedPhone');

    // Hasher le mot de passe pour comparaison
    final bytes = utf8.encode(password);
    final digest = sha256.convert(bytes);
    final passwordHash = digest.toString();

    // Chercher l'utilisateur par numéro de téléphone et mot de passe
    final response = await client
        .from('user_profiles')
        .select('*')
        .eq('phone', normalizedPhone)
        .eq('password_hash', passwordHash)
        .maybeSingle();

    print('Résultat de la recherche: $response');

    if (response == null) {
      throw Exception('Numéro de téléphone ou mot de passe incorrect');
    }

    // Créer une session custom
    _currentUser = response;
    
    return {
      'user': response,
      'session': {
        'user_id': response['id'],
        'phone': response['phone'],
        'created_at': DateTime.now().toIso8601String(),
      },
    };
  }

  static Future<void> signOut() async {
    _currentUser = null;
  }

  static Future<void> resetPasswordForPhone({
    required String phone,
  }) async {
    try {
      print('🔄 [RESET] Début de resetPasswordForPhone avec phone: $phone');
      
      // Normaliser le numéro de téléphone avec le préfixe +235
      String normalizedPhone = phone.replaceAll(' ', '').replaceAll('-', '');
      if (!normalizedPhone.startsWith('+235')) {
        normalizedPhone = '+235$normalizedPhone';
      }
      print('📱 [RESET] Numéro normalisé: $normalizedPhone');
      
      // Vérifier que l'utilisateur existe dans user_profiles
      print('🔍 [RESET] Recherche utilisateur dans user_profiles...');
      final userProfile = await client
          .from('user_profiles')
          .select('id, phone')
          .eq('phone', normalizedPhone)
          .maybeSingle();
      
      print('👤 [RESET] Résultat recherche: $userProfile');
      
      if (userProfile == null) {
        print('❌ [RESET] Utilisateur non trouvé');
        throw Exception('Utilisateur non trouvé avec ce numéro de téléphone');
      }
      
      // Pour l'instant, on simule l'envoi d'instructions
      // Dans une vraie implémentation, on enverrait un SMS avec un code
      print('✅ [RESET] Instructions de réinitialisation envoyées au $normalizedPhone');
      
    } catch (e, stackTrace) {
      print('💥 [RESET] ERREUR DÉTAILLÉE:');
      print('Type d\'erreur: ${e.runtimeType}');
      print('Message: $e');
      print('Stack trace: $stackTrace');
      rethrow;
    }
  }

  // Nouvelle fonction pour mettre à jour le mot de passe
  static Future<void> updatePasswordForPhone({
    required String phone,
    required String newPassword,
  }) async {
    try {
      print('🔄 [UPDATE_PWD] Début de updatePasswordForPhone avec phone: $phone');
      
      // Normaliser le numéro de téléphone avec le préfixe +235
      String normalizedPhone = phone.replaceAll(' ', '').replaceAll('-', '');
      if (!normalizedPhone.startsWith('+235')) {
        normalizedPhone = '+235$normalizedPhone';
      }
      print('📱 [UPDATE_PWD] Numéro normalisé: $normalizedPhone');
      
      // Hasher le nouveau mot de passe
      final bytes = utf8.encode(newPassword);
      final digest = sha256.convert(bytes);
      final passwordHash = digest.toString();
      print('🔐 [UPDATE_PWD] Nouveau mot de passe hashé');
      
      // Mettre à jour le mot de passe dans user_profiles
      print('🔄 [UPDATE_PWD] Mise à jour du mot de passe...');
      final response = await client
          .from('user_profiles')
          .update({'password_hash': passwordHash})
          .eq('phone', normalizedPhone)
          .select();
      
      print('✅ [UPDATE_PWD] Réponse mise à jour: $response');
      
      if (response.isEmpty) {
        throw Exception('Impossible de mettre à jour le mot de passe');
      }
      
      print('✅ [UPDATE_PWD] Mot de passe mis à jour avec succès pour $normalizedPhone');
      
    } catch (e, stackTrace) {
      print('💥 [UPDATE_PWD] ERREUR DÉTAILLÉE:');
      print('Type d\'erreur: ${e.runtimeType}');
      print('Message: $e');
      print('Stack trace: $stackTrace');
      rethrow;
    }
  }

  static Map<String, dynamic>? _currentUser;
  static Map<String, dynamic>? get currentUser => _currentUser;
  
  static Stream<AuthState> get authStateChanges => client.auth.onAuthStateChange;

  // SMS Verification (mock for testing)
  static Future<bool> verifyPhoneCode({
    required String phone,
    required String code,
  }) async {
    // Pour les tests, on accepte seulement 111111
    if (code == SupabaseConfig.testSmsCode) {
      return true;
    }
    return false;
  }

  // User profile methods
  static Future<Map<String, dynamic>?> getUserProfile(String userId) async {
    final response = await client
        .from('user_profiles')
        .select()
        .eq('id', userId)
        .maybeSingle();
    return response;
  }

  static Future<void> updateUserProfile({
    required String userId,
    required Map<String, dynamic> data,
  }) async {
    await client
        .from('user_profiles')
        .upsert({
          'id': userId,
          ...data,
          'updated_at': DateTime.now().toIso8601String(),
        });
  }
}
