// ignore_for_file: use_build_context_synchronously

import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_otp_text_field/flutter_otp_text_field.dart';
import 'package:another_flushbar/flushbar.dart';

import 'package:player/presentation/auth/pages/signin.dart';
import 'package:player/core/config/constants.dart';

class VerifyEmailOtpPage extends StatefulWidget {
  final String email;
  const VerifyEmailOtpPage({super.key, required this.email});

  @override
  State<VerifyEmailOtpPage> createState() => _VerifyEmailOtpPageState();
}

class _VerifyEmailOtpPageState extends State<VerifyEmailOtpPage> {
  String _otpCode = "";
  bool isLoading = false;

  int _secondsRemaining = 30;
  bool _canResend = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _showToast(String message,
      {Color color = Colors.green, IconData icon = Icons.check_circle}) {
    Flushbar(
      message: message,
      backgroundColor: color,
      duration: const Duration(seconds: 3),
      margin: const EdgeInsets.all(8),
      borderRadius: BorderRadius.circular(8),
      icon: Icon(icon, color: Colors.white),
      flushbarPosition: FlushbarPosition.TOP,
    ).show(context);
  }

  void _startCountdown() {
    setState(() {
      _secondsRemaining = 30;
      _canResend = false;
    });

    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() {
          _secondsRemaining--;
        });
      } else {
        setState(() {
          _canResend = true;
        });
        timer.cancel();
      }
    });
  }

  Future<void> _resendOtp() async {
    if (!_canResend) return;

    final url = Uri.parse('${AppConfig.baseUrl}/api/users/otp/send');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': widget.email}),
    );

    if (response.statusCode == 200) {
      _showToast("OTP resent to ${widget.email}");
      _startCountdown();
    } else {
      final data = json.decode(response.body);
      _showToast(data['message'] ?? "Failed to resend OTP",
          color: Colors.red, icon: Icons.error);
    }
  }

  Future<void> _verifyOtp() async {
    if (_otpCode.isEmpty || _otpCode.length < 4) {
      _showToast("Please enter the OTP",
          color: Colors.red, icon: Icons.warning_amber);
      return;
    }

    setState(() => isLoading = true);

    final url =
        Uri.parse('${AppConfig.baseUrl}/api/users/verify-email-otp');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': widget.email, 'otp': _otpCode}),
    );

    setState(() => isLoading = false);

    if (response.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('pending_verification');
      await prefs.remove('verifying_email');

      _showToast("Email verified successfully!");

      // Show animation
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.verified, color: Colors.green, size: 60),
              SizedBox(height: 16),
              Text("Verification Complete",
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      );

      await Future.delayed(const Duration(seconds: 2));
      Navigator.pop(context); // close dialog
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (_) => const SignIn()));
    } else {
      final data = json.decode(response.body);
      _showToast(data['message'] ?? "Verification failed",
          color: Colors.red, icon: Icons.error);
    }
  }

  Future<void> _cancelVerification() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('pending_verification');
    await prefs.remove('verifying_email');

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const SignIn()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Verify Email")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("An OTP was sent to ${widget.email}",
                style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 20),

            /// OTP Field
            OtpTextField(
              numberOfFields: 6,
              borderColor: const Color(0xFF512DA8),
              showFieldAsBox: true,
              onSubmit: (String code) {
                _otpCode = code;
              },
            ),

            const SizedBox(height: 30),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isLoading ? null : _verifyOtp,
                child: isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Verify"),
              ),
            ),

            const SizedBox(height: 16),

            Center(
              child: TextButton(
                onPressed: _canResend ? _resendOtp : null,
                child: Text(
                  _canResend
                      ? "Resend OTP"
                      : "Resend in $_secondsRemaining sec",
                  style: TextStyle(
                    color: _canResend ? Colors.green : Colors.grey,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 10),

            Center(
              child: TextButton(
                onPressed: _cancelVerification,
                child: const Text(
                  "Already have an account? Log in",
                  style: TextStyle(
                      color: Colors.red, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
