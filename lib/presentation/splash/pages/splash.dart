// ignore_for_file: use_build_context_synchronously, avoid_print

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:player/core/config/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:player/presentation/Main_Pages/navbar_roots.dart';
import 'package:player/presentation/intro/pages/get_started_screen.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    redirect();
  }

  Future<void> redirect() async {
    await Future.delayed(const Duration(seconds: 5));

    // ✅ Get FCM Token
    final fcmToken = await FirebaseMessaging.instance.getToken();
    print("📦 FCM Token: $fcmToken");

    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    print(isLoggedIn);
    final userId = prefs.getString('user_id') ?? 'unknown_user';

    // ✅ Optional: Save token to backend
    print("saving token to satabase");
    print("📛 userId from SharedPreferences: $userId");
    if (fcmToken != null && userId != 'unknown_user') {
  print('✅ FCM token is not null and userId is valid');
  print('👉 Sending token to backend...');
  print('📦 Payload: userId=$userId, token=$fcmToken');

  try {
    final response = await http.post(
      Uri.parse('${AppConfig.baseUrl}/api/token/save'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'userId': userId,
        'fcmToken': fcmToken,
      }),
    );

    print('📤 Status Code: ${response.statusCode}');
    print('📤 Response Body: ${response.body}');

    if (response.statusCode == 200) {
      print('✅ Token saved successfully to backend');
    } else {
      print('⚠️ Failed to save token. Status: ${response.statusCode}');
    }
  } catch (e) {
    print('❌ Error sending token: $e');
  }
} else {
  print('❌ Token or userId is invalid. Skipping upload.');
}

    print("saved to database");

    // ✅ Navigate to next screen
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (BuildContext context) =>
            isLoggedIn ? const Navbar() : const GetStartedScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Image.asset(
            './assets/images/logo.png',
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}
