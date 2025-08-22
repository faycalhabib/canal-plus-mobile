import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class ToggleSwitch extends StatelessWidget {
  final String leftLabel;
  final String rightLabel;
  final bool isLeftSelected;
  final Function(bool) onToggle;

  const ToggleSwitch({
    super.key,
    required this.leftLabel,
    required this.rightLabel,
    required this.isLeftSelected,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50,
      decoration: BoxDecoration(
        color: AppColors.inputBackground,
        borderRadius: BorderRadius.circular(25),
        border: Border.all(color: AppColors.inputBorder),
      ),
      child: Stack(
        children: [
          // Animated slider
          AnimatedPositioned(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeInOut,
            left: isLeftSelected ? 4 : null,
            right: isLeftSelected ? null : 4,
            top: 4,
            bottom: 4,
            width: MediaQuery.of(context).size.width * 0.4,
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(21),
              ),
            ),
          ),
          
          // Toggle options
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => onToggle(true),
                  child: Container(
                    height: double.infinity,
                    alignment: Alignment.center,
                    child: Text(
                      leftLabel,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: isLeftSelected 
                            ? Colors.white 
                            : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: () => onToggle(false),
                  child: Container(
                    height: double.infinity,
                    alignment: Alignment.center,
                    child: Text(
                      rightLabel,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: !isLeftSelected 
                            ? Colors.white 
                            : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
