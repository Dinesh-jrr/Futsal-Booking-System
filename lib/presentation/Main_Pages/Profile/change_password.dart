import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:player/core/config/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:player/utils/toast_helper.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  _ChangePasswordScreenState createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _oldPasswordController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  bool _isLoading = false;
  bool _isOldPasswordVisible = false;
  bool _isNewPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;

  Future<void> _changePassword() async {
    if (!_formKey.currentState!.validate()) return;

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userId = prefs.getString('user_id');

    if (userId == null) {
      showToast(
        context: context,
        message: "User not logged in.",
        backgroundColor: Colors.red,
        icon: Icons.error,
      );
      return;
    }

    setState(() => _isLoading = true);

    final response = await http.put(
      Uri.parse('${AppConfig.baseUrl}/api/users/change-password/$userId'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "currentPassword": _oldPasswordController.text,
        "newPassword": _newPasswordController.text,
      }),
    );

    setState(() => _isLoading = false);

    final resBody = jsonDecode(response.body);

    if (response.statusCode == 200 && resBody['success'] == true) {
      showToast(
        context: context,
        message: resBody['message'] ?? "Password changed successfully.",
        backgroundColor: Colors.green,
        icon: Icons.check_circle,
      );
    } else {
      showToast(
        context: context,
        message: resBody['message'] ?? "Failed to change password.",
        backgroundColor: Colors.red,
        icon: Icons.error,
      );
    }
  }

  Widget _buildPasswordTextField({
    required TextEditingController controller,
    required String label,
    required bool isVisible,
    required VoidCallback toggleVisibility,
    required String? Function(String?) validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: !isVisible,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: const Icon(Icons.lock),
        suffixIcon: IconButton(
          icon: Icon(
            isVisible ? Icons.visibility : Icons.visibility_off,
            color: Colors.green,
          ),
          onPressed: toggleVisibility,
        ),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
      validator: validator,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Change Password'),
        backgroundColor: Colors.green,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              _buildPasswordTextField(
                controller: _oldPasswordController,
                label: 'Old Password',
                isVisible: _isOldPasswordVisible,
                toggleVisibility: () => setState(() => _isOldPasswordVisible = !_isOldPasswordVisible),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Please enter your old password' : null,
              ),
              const SizedBox(height: 16),
              _buildPasswordTextField(
                controller: _newPasswordController,
                label: 'New Password',
                isVisible: _isNewPasswordVisible,
                toggleVisibility: () => setState(() => _isNewPasswordVisible = !_isNewPasswordVisible),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please enter a new password';
                  if (value.length < 6) return 'Password must be at least 6 characters';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildPasswordTextField(
                controller: _confirmPasswordController,
                label: 'Confirm Password',
                isVisible: _isConfirmPasswordVisible,
                toggleVisibility: () => setState(() => _isConfirmPasswordVisible = !_isConfirmPasswordVisible),
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Please confirm your password';
                  if (value != _newPasswordController.text) return 'Passwords do not match';
                  return null;
                },
              ),
              const SizedBox(height: 24),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _changePassword,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text('Change Password'),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
