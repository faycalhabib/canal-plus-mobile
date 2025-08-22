import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/services/supabase_service.dart';
import '../widgets/auth_header.dart';
import '../widgets/custom_text_field.dart';

class ResetPasswordPage extends StatefulWidget {
  final String phone;

  const ResetPasswordPage({
    super.key,
    required this.phone,
  });

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
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

  Future<void> _handleResetPassword() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      print('🔄 [RESET_PWD] Début de la réinitialisation pour ${widget.phone}');
      
      // Appeler la fonction de mise à jour du mot de passe
      await SupabaseService.updatePasswordForPhone(
        phone: widget.phone,
        newPassword: _passwordController.text,
      );
      
      print('✅ [RESET_PWD] Mot de passe mis à jour avec succès');
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Mot de passe modifié avec succès'),
            backgroundColor: AppColors.success,
          ),
        );
        context.go('/login');
      }
    } catch (e, stackTrace) {
      print('💥 [RESET_PWD] ERREUR:');
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
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AuthHeader(
                  title: 'Nouveau mot de passe',
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
                    color: AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(40),
                  ),
                  child: const Icon(
                    Icons.lock_outline,
                    size: 40,
                    color: AppColors.success,
                  ),
                ),
                
                const SizedBox(height: 24),
                
                Text(
                  'Créer un nouveau mot de passe',
                  style: Theme.of(context).textTheme.headlineMedium,
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 8),
                
                const Text(
                  'Votre nouveau mot de passe doit être différent du précédent',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 40),
                
                CustomTextField(
                  controller: _passwordController,
                  label: 'Nouveau mot de passe',
                  hintText: 'Entrez votre nouveau mot de passe',
                  isPassword: true,
                  isPasswordVisible: _isPasswordVisible,
                  onPasswordToggle: _togglePasswordVisibility,
                  validator: _validatePassword,
                  helperText: 'Au moins 8 caractères avec majuscule, minuscule et chiffre',
                ),
                
                const SizedBox(height: 16),
                
                CustomTextField(
                  controller: _confirmPasswordController,
                  label: 'Confirmer le mot de passe',
                  hintText: 'Confirmez votre nouveau mot de passe',
                  isPassword: true,
                  isPasswordVisible: _isConfirmPasswordVisible,
                  onPasswordToggle: _toggleConfirmPasswordVisibility,
                  validator: _validateConfirmPassword,
                ),
                
                const SizedBox(height: 32),
                
                SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _handleResetPassword,
                    child: _isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text('Modifier le mot de passe'),
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
