import 'package:flutter/material.dart';
import 'package:user/presentation/intro/pages/get_started.dart';

class GetStartedScreen extends StatefulWidget {
  const GetStartedScreen({super.key});

  @override
  State<GetStartedScreen> createState() => _GetStartedScreenState();
}

class _GetStartedScreenState extends State<GetStartedScreen> {
  // Add a PageController to manage page navigation
  final PageController _pageController = PageController();

  @override
  Widget build(BuildContext context) {
    return PageView(
      controller: _pageController,
      children: [
        GetStarted(
          backgroundImage: 'assets/images/futsal_pitch.jpg',
          logo: 'assets/images/logo.png',
          title: "Welcome to FutsalApp",
          description: "Discover the best futsal courts near you!",
          buttonText: "Get Started",
          onButtonTap: () {
            // Navigate to the next page
            Navigator.pushReplacementNamed(context, '/home');
          },
        ),
        GetStarted(
          backgroundImage: 'assets/images/futsal_pitch.jpg',
          logo: 'assets/images/logo.png',
          title: "Book Venues to Play with Friends",
          description: "Get Your Squad to Play Together !",
          buttonText: "Next",
          onButtonTap: () {
            // Navigate to the next page
            _pageController.nextPage(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
            );         
          },
        ),
        GetStarted(
          backgroundImage: 'assets/images/futsal_pitch.jpg',
          logo: 'assets/images/logo.png',
          title: "Split Payments",
          description: "Share booking costs seamlessly with teammates.",
          buttonText: "Get Started",
          onButtonTap: () {
            // Navigate to the final page (or handle final navigation)
            Navigator.pushNamed(context, '/login');
          },
        ),
      ],
    );
  }
}
