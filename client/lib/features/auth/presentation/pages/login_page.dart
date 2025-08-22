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

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _decoderController = TextEditingController();
  final _passwordController = TextEditingController();
  
  bool _isPhoneMode = true;
  bool _isPasswordVisible = false;
  bool _isLoading = false;
  String _countryCode = '+235';

  @override
  void dispose() {
    _phoneController.dispose();
    _decoderController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _toggleLoginMode(bool isPhone) {
    setState(() {
      _isPhoneMode = isPhone;
    });
  }

  void _togglePasswordVisibility() {
    setState(() {
      _isPasswordVisible = !_isPasswordVisible;
    });
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final authController = ref.read(authControllerProvider);
      
      if (_isPhoneMode) {
        final normalizedPhone = PhoneUtils.normalizeForBackend(_phoneController.text);
        await authController.signInWithPhone(
          phone: normalizedPhone,
          password: _passwordController.text,
        );
      } else {
        // TODO: Implement decoder login
        throw Exception('Connexion par décodeur non implémentée');
      }
      
      if (mounted) {
        context.go('/home');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur de connexion: $e'),
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
    if (value.length < 8) {
      return 'Numéro de téléphone invalide';
    }
    return null;
  }

  String? _validateDecoder(String? value) {
    if (value == null || value.isEmpty) {
      return 'Veuillez entrer le numéro de votre décodeur';
    }
    if (value.length != 14) {
      return 'Le numéro de décodeur doit contenir 14 chiffres';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Veuillez entrer votre mot de passe';
    }
    if (value.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
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
                // Header with back button and logo
                AuthHeader(
                  title: 'Connexion',
                  onBackPressed: () => context.go('/splash'),
                ),
                
                const SizedBox(height: 40),
                
                // Toggle switch for phone/decoder
                ToggleSwitch(
                  leftLabel: 'Numéro',
                  rightLabel: 'Décodeur',
                  isLeftSelected: _isPhoneMode,
                  onToggle: _toggleLoginMode,
                ),
                
                const SizedBox(height: 32),
                
                // Phone form section
                if (_isPhoneMode) ...[
                  // Phone number input
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
                          // Country code picker
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
                          // Phone number field
                          Expanded(
                            child: CustomTextField(
                              controller: _phoneController,
                              hintText: '91 91 21 91',
                              keyboardType: TextInputType.phone,
                              validator: _validatePhone,
                              inputFormatters: [PhoneNumberFormatter()],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ] else ...[
                  // Decoder number input
                  CustomTextField(
                    controller: _decoderController,
                    label: 'Numéro du décodeur',
                    hintText: 'Entrez les 14 chiffres de votre décodeur',
                    keyboardType: TextInputType.number,
                    validator: _validateDecoder,
                    helperText: 'Vous trouverez ce numéro au dos de votre décodeur',
                  ),
                ],
                
                const SizedBox(height: 24),
                
                // Password field
                CustomTextField(
                  controller: _passwordController,
                  label: 'Mot de passe',
                  hintText: 'Entrez votre mot de passe',
                  isPassword: true,
                  isPasswordVisible: _isPasswordVisible,
                  onPasswordToggle: _togglePasswordVisibility,
                  validator: _validatePassword,
                ),
                
                const SizedBox(height: 32),
                
                // Login button
                SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _handleLogin,
                    child: _isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text('Se connecter'),
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Footer links
                Column(
                  children: [
                    TextButton(
                      onPressed: () => context.go('/forgot-password'),
                      child: const Text(
                        'Mot de passe oublié ?',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Pas de compte ? ',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 16,
                          ),
                        ),
                        TextButton(
                          onPressed: () => context.go('/register'),
                          child: const Text(
                            'Inscrivez-vous',
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
