// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:player/core/config/constants.dart';
import 'package:player/presentation/auth/pages/signin.dart';

class VerifyOtpPage extends StatefulWidget {
  final String email;
  const VerifyOtpPage({super.key, required this.email});

  @override
  State<VerifyOtpPage> createState() => _VerifyOtpPageState();
}

class _VerifyOtpPageState extends State<VerifyOtpPage> {
  final TextEditingController _otpController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  bool isLoading = false;
  bool obscurePassword = true;

  Future<void> verifyOtpAndResetPassword() async {
    final otp = _otpController.text.trim();
    final newPassword = _newPasswordController.text.trim();

    if (otp.isEmpty || newPassword.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill all fields")),
      );
      return;
    }

    setState(() => isLoading = true);

    final response = await http.post(
      Uri.parse('${AppConfig.baseUrl}/api/users/password/reset'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': widget.email,
        'otp': otp,
        'newPassword': newPassword,
      }),
    );

    setState(() => isLoading = false);

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Password reset successful")),
      );
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (context) => const SignIn()),
);
        }
      });
    } else {
      final data = json.decode(response.body);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(data['message'] ?? "Invalid OTP or failed to reset")),
      );
    }
  }

  bool get isFormValid =>
      _otpController.text.isNotEmpty && _newPasswordController.text.isNotEmpty;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Verify OTP")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text("An OTP was sent to ${widget.email}"),
            const SizedBox(height: 20),
            TextField(
              controller: _otpController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: "Enter OTP",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _newPasswordController,
              obscureText: obscurePassword,
              decoration: InputDecoration(
                labelText: "New Password",
                border: const OutlineInputBorder(),
                suffixIcon: IconButton(
                  icon: Icon(obscurePassword
                      ? Icons.visibility
                      : Icons.visibility_off),
                  onPressed: () {
                    setState(() {
                      obscurePassword = !obscurePassword;
                    });
                  },
                ),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: isLoading || !isFormValid
                  ? null
                  : verifyOtpAndResetPassword,
              child: isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text("Reset Password"),
            )
          ],
        ),
      ),
    );
  }
}
