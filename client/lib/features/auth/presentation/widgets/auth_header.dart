import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class AuthHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onBackPressed;

  const AuthHeader({
    super.key,
    required this.title,
    this.onBackPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Back button and logo row
        Row(
          children: [
            if (onBackPressed != null)
              IconButton(
                onPressed: () {
                  if (Navigator.of(context).canPop()) {
                    onBackPressed!();
                  }
                },
                icon: const Icon(
                  Icons.arrow_back_ios,
                  color: AppColors.textPrimary,
                  size: 24,
                ),
              ),
            const Spacer(),
            // Canal+ Logo
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  'assets/images/logo.png',
                  width: 60,
                  height: 60,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            const Spacer(),
            const SizedBox(width: 48), // Balance the back button
          ],
        ),
        
        const SizedBox(height: 32),
        
        // Title
        Text(
          title,
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
