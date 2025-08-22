import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/supabase_service.dart';

// Current user provider (custom auth)
final currentUserProvider = Provider<Map<String, dynamic>?>((ref) {
  return SupabaseService.currentUser;
});

// Auth controller provider
final authControllerProvider = Provider<AuthController>((ref) {
  return AuthController();
});

class AuthController {
  // Register with phone
  Future<Map<String, dynamic>> registerWithPhone({
    required String phone,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    // Validation des données
    if (phone.isEmpty || password.isEmpty || firstName.isEmpty || lastName.isEmpty) {
      throw Exception('Tous les champs sont requis');
    }
    
    if (password.length < 8) {
      throw Exception('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    // Supprimer la validation du format +235 car on normalise automatiquement
    if (phone.length < 8) {
      throw Exception('Numéro de téléphone invalide');
    }

    return await SupabaseService.signUpWithPhone(
      phone: phone,
      password: password,
      data: {
        'first_name': firstName,
        'last_name': lastName,
      },
    );
  }

  // Login with phone
  Future<Map<String, dynamic>> loginWithPhone({
    required String phone,
    required String password,
  }) async {
    return await SupabaseService.signInWithPhone(
      phone: phone,
      password: password,
    );
  }

  // Sign in with phone (alias for loginWithPhone)
  Future<Map<String, dynamic>> signInWithPhone({
    required String phone,
    required String password,
  }) async {
    return await loginWithPhone(
      phone: phone,
      password: password,
    );
  }

  // Verify phone code
  Future<bool> verifyPhoneCode({
    required String phone,
    required String code,
  }) async {
    return await SupabaseService.verifyPhoneCode(
      phone: phone,
      code: code,
    );
  }

  // Reset password
  Future<void> resetPassword(String phone) async {
    await SupabaseService.resetPasswordForPhone(phone: phone);
  }

  // Sign out
  Future<void> signOut() async {
    await SupabaseService.signOut();
  }

  // Update user profile
  Future<void> updateProfile({
    required String userId,
    required Map<String, dynamic> data,
  }) async {
    // TODO: Implémenter updateUserProfile dans SupabaseService
    // await SupabaseService.updateUserProfile(
    //   userId: userId,
    //   data: data,
    // );
  }
}
