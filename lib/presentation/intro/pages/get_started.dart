import 'package:flutter/material.dart';
import 'package:user/core/config/theme/app_colors.dart';

class GetStarted extends StatelessWidget {
  final String backgroundImage;
  final String logo;
  final String title;
  final String description;
  final String buttonText;
  final VoidCallback onButtonTap;
  
  const GetStarted({
    required this.backgroundImage,
    required this.logo,
    required this.title,
    required this.description,
    required this.buttonText,
    required this.onButtonTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Upper Block: Scrollable content
          Expanded(
            flex: 1,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Background image with logo
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Image.asset(
                        backgroundImage, // Background image
                        width: double.infinity,
                        height: MediaQuery.of(context).size.height * 0.4,
                        fit: BoxFit.cover,
                      ),
                      Positioned(
                        top: 20,
                        left: 20,
                        child: Image.asset(
                          logo, // Logo
                          width: 80,
                          height: 80,
                        ),
                      ),
                    ],
                  ),
                  // Text content (title and description)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Column(
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          description,
                          style: const TextStyle(
                            fontSize: 16,
                            color: AppColors.primary,
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
          
          // Lower Block: Static content (button)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
            child: Column(
              children: [
                Text(
                  "Get ready to play your best game yet!",
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: onButtonTap, // On tap will trigger navigation
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      buttonText,
                      style: const TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
