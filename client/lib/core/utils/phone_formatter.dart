import 'package:flutter/services.dart';

class PhoneNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    // Remove all non-digit characters
    String digitsOnly = newValue.text.replaceAll(RegExp(r'\D'), '');
    
    // Limit to 8 digits for Chad phone numbers
    if (digitsOnly.length > 8) {
      digitsOnly = digitsOnly.substring(0, 8);
    }
    
    // Format with spaces: XX XX XX XX
    String formatted = '';
    for (int i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 2 == 0) {
        formatted += ' ';
      }
      formatted += digitsOnly[i];
    }
    
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

class PhoneUtils {
  /// Format phone number for display: 91912191 -> 91 91 21 91
  static String formatForDisplay(String phoneNumber) {
    // Remove all non-digit characters
    String digitsOnly = phoneNumber.replaceAll(RegExp(r'\D'), '');
    
    // Remove +235 prefix if present
    if (digitsOnly.startsWith('235') && digitsOnly.length > 8) {
      digitsOnly = digitsOnly.substring(3);
    }
    
    // Limit to 8 digits
    if (digitsOnly.length > 8) {
      digitsOnly = digitsOnly.substring(0, 8);
    }
    
    // Format with spaces: XX XX XX XX
    String formatted = '';
    for (int i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 2 == 0) {
        formatted += ' ';
      }
      formatted += digitsOnly[i];
    }
    
    return formatted;
  }
  
  /// Normalize phone number for backend: 91 91 21 91 -> +23591912191
  static String normalizeForBackend(String phoneNumber) {
    // Remove all non-digit characters
    String digitsOnly = phoneNumber.replaceAll(RegExp(r'\D'), '');
    
    // Remove +235 prefix if already present
    if (digitsOnly.startsWith('235') && digitsOnly.length > 8) {
      digitsOnly = digitsOnly.substring(3);
    }
    
    // Add Chad country code
    return '+235$digitsOnly';
  }
  
  /// Get raw digits only: 91 91 21 91 -> 91912191
  static String getRawDigits(String phoneNumber) {
    String digitsOnly = phoneNumber.replaceAll(RegExp(r'\D'), '');
    
    // Remove +235 prefix if present
    if (digitsOnly.startsWith('235') && digitsOnly.length > 8) {
      digitsOnly = digitsOnly.substring(3);
    }
    
    return digitsOnly;
  }
}
