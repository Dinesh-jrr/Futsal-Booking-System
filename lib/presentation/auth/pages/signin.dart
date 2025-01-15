import 'package:flutter/material.dart';
import 'package:user/core/config/theme/app_colors.dart';

class SignIn extends StatelessWidget {
  const SignIn({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Logo at the top
            Center(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16), // Rounded border
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.asset(
                    './assets/images/logo.png',
                    height: 100,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Create Account text
            const Center(
              child: Text(
                "Welcome !",
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
            const SizedBox(height: 15),
            const Center(
              child:  Text(
                "Sign in to your account",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black
                ),
              ),
            ),
            const SizedBox(height:20,),

            // Email input field
          const Text(
                "Email",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            const SizedBox(height: 8),
            TextField(
                decoration: InputDecoration(
                   prefixIcon: const Icon(Icons.email, color: Colors.green),
                  hintText: 'Enter your email',
                  contentPadding: const EdgeInsets.symmetric(vertical: 20),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8.0), // Optional: Rounded corners
                    borderSide: const BorderSide(color: Colors.green, width: 1.5), // Stroke width and color
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8.0),
                    borderSide: const BorderSide(color: Colors.green, width: 1.5),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8.0),
                    borderSide: const BorderSide(color: Colors.green, width: 1.5),
                  ),
                  //prefixIcon: const Icon(Icons.email, color: Colors.green),
                  fillColor: Colors.transparent, // Ensure the background is not filled
                  filled: false, // Disable background filling
                ),
              ),
            const SizedBox(height: 25),


            // Password input field
            const Text(
                "Password",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            const SizedBox(height: 8,),
            TextField(
                decoration: InputDecoration(
                   prefixIcon: const Icon(Icons.password, color: Colors.green),
                  hintText: 'Enter your Password',
                  contentPadding: const EdgeInsets.symmetric(vertical: 20),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8.0), // Optional: Rounded corners
                    borderSide: const BorderSide(color: AppColors.primary, width: 1.5), // Stroke width and color
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8.0),
                    borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8.0),
                    borderSide: const BorderSide(color: AppColors.primary,width: 1.5),
                  ),
                  //prefixIcon: const Icon(Icons.email, color: Colors.green),
                  fillColor: Colors.transparent, // Ensure the background is not filled
                  filled: false, // Disable background filling
                ),
              ),
            const SizedBox(height: 8),


             // Forgot Password link (right-aligned)
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () {
                    // Handle Forgot Password logic
                  },
                  child: const Text(
                    "Forgot Password?",
                    style: TextStyle(
                      fontFamily: 'Roboto',
                      fontSize: 14,
                      color: Colors.red,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height:30),

            // Sign In button
            ElevatedButton(
              onPressed: () {
                // Handle sign-in logic
              },
              style: ElevatedButton.styleFrom(
                backgroundColor:AppColors.primary,
                padding: const EdgeInsets.symmetric(vertical: 24.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
              child: const Text(
                "Sign In",
                style: TextStyle(
                  fontFamily: 'Roboto',
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 30),

            // Sign in with Google button
            OutlinedButton.icon(
                onPressed: () {
                  // Handle Google sign-in logic
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.green, width: 2),
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
                icon: Image.asset(
                  'assets/icons/google.png',  // Update the path here
                  height: 24,
                ),
                label: const Text(
                  "Sign in with Google",
                  style: TextStyle(
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ),
            const SizedBox(height: 30),

            // Already have an account? Sign in
            Center(
              child: TextButton(
                onPressed: () {
                  // Navigate to sign-up page
                   },
            child: const Text.rich(
              TextSpan(
                text: "Don't have an account? ",
                style: TextStyle(
                  fontFamily: 'Roboto',
                  fontSize: 16,
                  color: Colors.black, // Regular text color
                ),
                children: [
                  TextSpan(
                    text: "Sign Up", // Text to color
                    style: TextStyle(
                      fontFamily: 'Roboto',
                      fontSize: 16,
                      color: AppColors.primary, // Apply primary color here
                    ),
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