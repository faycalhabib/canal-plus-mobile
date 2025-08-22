import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:country_code_picker/country_code_picker.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/phone_formatter.dart';
import '../widgets/auth_header.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/toggle_switch.dart';
import '../providers/auth_provider.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _decoderController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  bool _isPhoneMode = true;
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isLoading = false;
  bool _acceptTerms = false;
  String _countryCode = '+235';

  @override
  void dispose() {
    _phoneController.dispose();
    _decoderController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _toggleRegistrationMode(bool isPhone) {
    setState(() {
      _isPhoneMode = isPhone;
    });
  }

  void _togglePasswordVisibility() {
    setState(() {
      _isPasswordVisible = !_isPasswordVisible;
    });
  }

  void _toggleConfirmPasswordVisibility() {
    setState(() {
      _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
    });
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    
    if (!_acceptTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Veuillez accepter les conditions d\'utilisation'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final authController = ref.read(authControllerProvider);
      
      if (_isPhoneMode) {
        // Normaliser le numéro de téléphone
        final normalizedPhone = PhoneUtils.normalizeForBackend(_phoneController.text);
        final response = await authController.registerWithPhone(
          phone: normalizedPhone,
          password: _passwordController.text,
          firstName: _firstNameController.text,
          lastName: _lastNameController.text,
        );
        
        if (mounted) {
          context.go('/verify-phone', extra: normalizedPhone);
        }
      } else {
        // Pour le décodeur, on va directement à la vérification
        await Future.delayed(const Duration(seconds: 1));
        if (mounted) {
          context.go('/verify-phone', extra: _decoderController.text);
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur d\'inscription: ${e.toString()}'),
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

  String? _validateRequired(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return 'Veuillez entrer votre $fieldName';
    }
    return null;
  }


  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Veuillez entrer un mot de passe';
    }
    if (value.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(value)) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }
    return null;
  }

  String? _validateConfirmPassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Veuillez confirmer votre mot de passe';
    }
    if (value != _passwordController.text) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header
                AuthHeader(
                  title: 'Inscription',
                  onBackPressed: () => context.go('/login'),
                ),
                
                const SizedBox(height: 32),
                
                // Toggle switch
                ToggleSwitch(
                  leftLabel: 'Numéro',
                  rightLabel: 'Décodeur',
                  isLeftSelected: _isPhoneMode,
                  onToggle: _toggleRegistrationMode,
                ),
                
                const SizedBox(height: 24),
                
                // Personal information
                Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        controller: _firstNameController,
                        label: 'Prénom',
                        hintText: 'Votre prénom',
                        validator: (value) => _validateRequired(value, 'prénom'),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: CustomTextField(
                        controller: _lastNameController,
                        label: 'Nom',
                        hintText: 'Votre nom',
                        validator: (value) => _validateRequired(value, 'nom'),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                const SizedBox(height: 16),
                
                // Phone or decoder input
                if (_isPhoneMode) ...[
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
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Veuillez entrer votre numéro de téléphone';
                                }
                                if (!RegExp(r'^[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}$').hasMatch(value)) {
                                  return 'Format: 91 91 21 91';
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Format: 91 91 21 91',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textHint,
                        ),
                      ),
                    ],
                  ),
                ] else ...[
                  CustomTextField(
                    controller: _decoderController,
                    label: 'Numéro du décodeur',
                    hintText: 'Entrez les 14 chiffres de votre décodeur',
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Veuillez entrer le numéro de votre décodeur';
                      }
                      if (value.length != 14) {
                        return 'Le numéro de décodeur doit contenir 14 chiffres';
                      }
                      return null;
                    },
                    helperText: 'Vous trouverez ce numéro au dos de votre décodeur',
                  ),
                ],
                
                const SizedBox(height: 16),
                
                // Password
                CustomTextField(
                  controller: _passwordController,
                  label: 'Mot de passe',
                  hintText: 'Créez un mot de passe sécurisé',
                  isPassword: true,
                  isPasswordVisible: _isPasswordVisible,
                  onPasswordToggle: _togglePasswordVisibility,
                  validator: _validatePassword,
                  helperText: 'Au moins 8 caractères avec majuscule, minuscule et chiffre',
                ),
                
                const SizedBox(height: 16),
                
                // Confirm password
                CustomTextField(
                  controller: _confirmPasswordController,
                  label: 'Confirmer le mot de passe',
                  hintText: 'Confirmez votre mot de passe',
                  isPassword: true,
                  isPasswordVisible: _isConfirmPasswordVisible,
                  onPasswordToggle: _toggleConfirmPasswordVisibility,
                  validator: _validateConfirmPassword,
                ),
                
                const SizedBox(height: 24),
                
                // Terms and conditions
                Row(
                  children: [
                    Checkbox(
                      value: _acceptTerms,
                      onChanged: (value) {
                        setState(() {
                          _acceptTerms = value ?? false;
                        });
                      },
                      activeColor: AppColors.primary,
                    ),
                    Expanded(
                      child: RichText(
                        text: const TextSpan(
                          style: TextStyle(
                            fontSize: 14,
                            color: AppColors.textSecondary,
                          ),
                          children: [
                            TextSpan(text: 'J\'accepte les '),
                            TextSpan(
                              text: 'conditions d\'utilisation',
                              style: TextStyle(
                                color: AppColors.primary,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                            TextSpan(text: ' et la '),
                            TextSpan(
                              text: 'politique de confidentialité',
                              style: TextStyle(
                                color: AppColors.primary,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 32),
                
                // Register button
                SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _handleRegister,
                    child: _isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text('S\'inscrire'),
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Login link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Déjà un compte ? ',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 16,
                      ),
                    ),
                    TextButton(
                      onPressed: () => context.go('/login'),
                      child: const Text(
                        'Connectez-vous',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
