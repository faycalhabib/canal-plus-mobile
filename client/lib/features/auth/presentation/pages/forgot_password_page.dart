import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:country_code_picker/country_code_picker.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/services/supabase_service.dart';
import '../../../../core/utils/phone_formatter.dart';
import '../widgets/auth_header.dart';
import '../widgets/custom_text_field.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  bool _isLoading = false;
  String _countryCode = '+235';

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _handleForgotPassword() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      print('🚀 [FORGOT] Début du processus de récupération');
      print('📱 [FORGOT] Numéro saisi: ${_phoneController.text}');
      print('🌍 [FORGOT] Code pays: $_countryCode');
      
      print('🔧 [FORGOT] Appel resetPasswordForPhone...');
      
      // Normaliser et appeler la fonction de réinitialisation
      final normalizedPhone = PhoneUtils.normalizeForBackend(_phoneController.text);
      await SupabaseService.resetPasswordForPhone(
        phone: normalizedPhone,
      );
      
      print('✅ [FORGOT] Fonction resetPasswordForPhone terminée avec succès');
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Code SMS envoyé au ${_phoneController.text}'),
            backgroundColor: AppColors.success,
          ),
        );
        
        // Naviguer vers la page de validation SMS avec contexte reset-password
        context.go('/verify-phone', extra: {
          'phone': normalizedPhone,
          'context': 'reset-password'
        });
      }
    } catch (e, stackTrace) {
      print('💥 [FORGOT] ERREUR DANS _handleForgotPassword:');
      print('Type: ${e.runtimeType}');
      print('Message: $e');
      print('Stack trace: $stackTrace');
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  String? _validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Veuillez entrer votre numéro de téléphone';
    }
    if (!RegExp(r'^[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$').hasMatch(value)) {
      return 'Format: 90 12 34 56';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AuthHeader(
                  title: 'Mot de passe oublié',
                  onBackPressed: () {
                    if (context.canPop()) {
                      context.pop();
                    } else {
                      context.go('/login');
                    }
                  },
                ),
                
                const SizedBox(height: 40),
                
                // Icon
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(40),
                  ),
                  child: const Icon(
                    Icons.lock_reset_outlined,
                    size: 40,
                    color: AppColors.primary,
                  ),
                ),
                
                const SizedBox(height: 24),
                
                Text(
                  'Récupération du mot de passe',
                  style: Theme.of(context).textTheme.headlineMedium,
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 8),
                
                const Text(
                  'Entrez votre numéro de téléphone pour recevoir les instructions de récupération',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 40),
                
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Numéro de téléphone',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: AppColors.inputBackground,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.inputBorder),
                          ),
                          child: CountryCodePicker(
                            onChanged: (country) {
                              _countryCode = country.dialCode!;
                            },
                            initialSelection: 'TD',
                            favorite: const ['+235', 'TD'],
                            showCountryOnly: false,
                            showOnlyCountryWhenClosed: false,
                            alignLeft: false,
                            textStyle: const TextStyle(color: AppColors.textPrimary),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: CustomTextField(
                            controller: _phoneController,
                            hintText: '91 91 21 91',
                            keyboardType: TextInputType.phone,
                            inputFormatters: [PhoneNumberFormatter()],
                            validator: _validatePhone,
                            prefixIcon: const Icon(
                              Icons.phone_outlined,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                
                const SizedBox(height: 32),
                
                SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _handleForgotPassword,
                    child: _isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text('Envoyer les instructions'),
                  ),
                ),
                
                const Spacer(),
                
                TextButton(
                  onPressed: () => context.go('/login'),
                  child: const Text(
                    'Retour à la connexion',
                    style: TextStyle(
                      color: AppColors.primary,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
