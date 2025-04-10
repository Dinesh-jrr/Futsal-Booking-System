// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:player/core/config/theme/app_colors.dart';
import 'package:player/presentation/auth/pages/signup.dart';
import 'package:player/presentation/auth/pages/forgot_password.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:google_sign_in/google_sign_in.dart';

class SignIn extends StatefulWidget {
  const SignIn({super.key});

  @override
  State<SignIn> createState() => _SignInState();
}

class _SignInState extends State<SignIn> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;

  Future<void> _signIn() async {
    final String email = _emailController.text;
    final String password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill in both fields")),
      );
      return;
    }

    try {
      final response = await http.post(
        Uri.parse('http://192.168.1.5:5000/api/users/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseBody = json.decode(response.body);
        if (responseBody.containsKey('token')) {
          final String token = responseBody['token'];
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setString('auth_token', token);

          Navigator.pushReplacementNamed(context, '/home');
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Login failed: No token found")),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Login failed: Invalid credentials")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Login failed: Network error")),
      );
    }
  }

  Future<void> _checkSession() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('auth_token');
    if (token != null) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  }

  Future<void> handleGoogleLogin() async {
    final GoogleSignIn googleSignIn = GoogleSignIn(scopes: ['email']);
    final GoogleSignInAccount? account = await googleSignIn.signIn();

    if (account != null) {
      final String email = account.email;
      final String name = account.displayName ?? 'Google User';
      final String googleId = account.id;
      final GoogleSignInAuthentication auth = await account.authentication;
      final String? idToken = auth.idToken;

      final response = await http.post(
        Uri.parse('http://192.168.1.5:5000/api/users/google-login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'name': name,
          'googleId': googleId,
          'idToken': idToken,
        }),
      );

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final token = body['token'];
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Google login failed: ${response.body}")),
        );
      }
    }
  }

  @override
  void initState() {
    super.initState();
    _checkSession();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 40),
            Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.asset(
                  './assets/images/logo.png',
                  height: 100,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Center(
              child: Text("Welcome !", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 15),
            const Center(
              child: Text("Sign in to your account", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 20),
            const Text("Email", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.email, color: Colors.green),
                hintText: 'Enter your email',
                contentPadding: const EdgeInsets.symmetric(vertical: 20),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8.0), borderSide: const BorderSide(color: Colors.green)),
              ),
            ),
            const SizedBox(height: 25),
            const Text("Password", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: _passwordController,
              obscureText: _obscurePassword,
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.password, color: Colors.green),
                hintText: 'Enter your Password',
                contentPadding: const EdgeInsets.symmetric(vertical: 20),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8.0), borderSide: const BorderSide(color: AppColors.primary)),
                suffixIcon: IconButton(
                  icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, color: Colors.green),
                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ForgotPasswordPage())),
                  child: const Text("Forgot Password?", style: TextStyle(fontSize: 14, color: Colors.red)),
                ),
              ],
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: _signIn,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(vertical: 24.0),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
              ),
              child: const Text("Sign In", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            ),
            const SizedBox(height: 30),
            OutlinedButton.icon(
              onPressed: handleGoogleLogin,
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.green, width: 2),
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
              ),
              icon: Image.asset('assets/icons/google.png', height: 24),
              label: const Text("Sign in with Google", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green)),
            ),
            const SizedBox(height: 30),
            Center(
              child: TextButton(
                onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const SignUp())),
                child: const Text.rich(
                  TextSpan(
                    text: "Don't have an account? ",
                    style: TextStyle(fontSize: 16, color: Colors.black),
                    children: [
                      TextSpan(
                        text: "Sign Up",
                        style: TextStyle(fontSize: 16, color: AppColors.primary, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
