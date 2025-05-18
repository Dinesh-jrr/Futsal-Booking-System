// lib/utils/esewa_utils.dart

import 'package:url_launcher/url_launcher.dart';

// Call this on tap
void launchEsewaPayment(String url) async {
  if (await canLaunchUrl(Uri.parse(url))) {
    await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  } else {
    throw 'Could not launch $url';
  }
}

String generateEsewaPaymentUrl({
  required String scd,
  required String pid,
  required String amt,
}) {
  return 'https://esewa.com.np/epay/main?amt=$amt&scd=$scd&pid=$pid';
}


// Call this on tap
void launchEsewaUrl(String url) async {
  if (await canLaunchUrl(Uri.parse(url))) {
    await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  } else {
    throw 'Could not launch $url';
  }
}
