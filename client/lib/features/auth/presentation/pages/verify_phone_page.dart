import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import '../../../../core/constants/app_colors.dart';
import '../widgets/auth_header.dart';
import '../providers/auth_provider.dart';

class VerifyPhonePage extends ConsumerStatefulWidget {
  final String phoneNumber;
  final String? context; // 'reset-password' or null for registration

  const VerifyPhonePage({
    super.key,
    required this.phoneNumber,
    this.context,
  });

  @override
  ConsumerState<VerifyPhonePage> createState() => _VerifyPhonePageState();
}

class _VerifyPhonePageState extends ConsumerState<VerifyPhonePage> {
  final _pinController = TextEditingController();
  bool _isLoading = false;
  bool _isResending = false;
  int _countdown = 60;
  late String _maskedPhoneNumber;

  @override
  void initState() {
    super.initState();
    _maskedPhoneNumber = _maskPhoneNumber(widget.phoneNumber);
    _startCountdown();
  }

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  String _maskPhoneNumber(String phoneNumber) {
    if (phoneNumber.length >= 4) {
      final start = phoneNumber.substring(0, phoneNumber.length - 4);
      final end = phoneNumber.substring(phoneNumber.length - 4);
      return '${start.replaceAll(RegExp(r'\d'), '*')}$end';
    }
    return phoneNumber;
  }

  void _startCountdown() {
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) {
        setState(() {
          _countdown--;
        });
        return _countdown > 0;
      }
      return false;
    });
  }

  Future<void> _verifyCode() async {
    if (_pinController.text.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Veuillez entrer le code à 6 chiffres'),
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
      
      final isValid = await authController.verifyPhoneCode(
        phone: widget.phoneNumber,
        code: _pinController.text,
      );
      
      if (isValid && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Vérification réussie !'),
            backgroundColor: AppColors.success,
          ),
        );
        
        // Navigate based on context
        if (widget.context == 'reset-password') {
          context.go('/reset-password', extra: {'phone': widget.phoneNumber});
        } else {
          context.go('/home');
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Code invalide. Utilisez 111111 pour tester.'),
              backgroundColor: AppColors.error,
            ),
          );
          _pinController.clear();
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: $e'),
            backgroundColor: AppColors.error,
          ),
        );
        _pinController.clear();
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _resendCode() async {
    setState(() {
      _isResending = true;
    });

    try {
      // TODO: Implement actual resend logic
      await Future.delayed(const Duration(seconds: 1));
      
      if (mounted) {
        setState(() {
          _countdown = 60;
        });
        _startCountdown();
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Code renvoyé avec succès'),
            backgroundColor: AppColors.success,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors du renvoi: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isResending = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              AuthHeader(
                title: 'Vérification',
                onBackPressed: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/login');
                  }
                },
              ),
              
              const SizedBox(height: 40),
              
              // SMS icon
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(40),
                ),
                child: const Icon(
                  Icons.sms_outlined,
                  size: 40,
                  color: AppColors.primary,
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Instructions
              Text(
                'Code de vérification envoyé',
                style: Theme.of(context).textTheme.headlineMedium,
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 8),
              
              Text(
                'Nous avons envoyé un code à 6 chiffres au numéro',
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 4),
              
              Text(
                _maskedPhoneNumber,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 40),
              
              // PIN input
              PinCodeTextField(
                appContext: context,
                length: 6,
                controller: _pinController,
                keyboardType: TextInputType.number,
                animationType: AnimationType.fade,
                pinTheme: PinTheme(
                  shape: PinCodeFieldShape.box,
                  borderRadius: BorderRadius.circular(12),
                  fieldHeight: 56,
                  fieldWidth: 48,
                  activeFillColor: AppColors.inputBackground,
                  inactiveFillColor: AppColors.inputBackground,
                  selectedFillColor: AppColors.inputBackground,
                  activeColor: AppColors.primary,
                  inactiveColor: AppColors.inputBorder,
                  selectedColor: AppColors.primary,
                ),
                enableActiveFill: true,
                textStyle: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
                onCompleted: (value) {
                  _verifyCode();
                },
                onChanged: (value) {
                  // Auto-verify when 6 digits are entered
                },
              ),
              
              const SizedBox(height: 32),
              
              // Verify button
              SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _verifyCode,
                  child: _isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text('Vérifier'),
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Resend code
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Code non reçu ? ',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 16,
                    ),
                  ),
                  if (_countdown > 0)
                    Text(
                      'Renvoyer dans ${_countdown}s',
                      style: const TextStyle(
                        color: AppColors.textHint,
                        fontSize: 16,
                      ),
                    )
                  else
                    TextButton(
                      onPressed: _isResending ? null : _resendCode,
                      child: _isResending
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                              ),
                            )
                          : const Text(
                              'Renvoyer',
                              style: TextStyle(
                                color: AppColors.primary,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                    ),
                ],
              ),
              
              const Spacer(),
              
              // Help text
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.info_outline,
                      color: AppColors.info,
                      size: 24,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Problème de réception ?',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Vérifiez votre signal réseau ou contactez le support',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
