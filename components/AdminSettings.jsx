import { useState } from "react";

export default function AdminSettings() {
  const [appName, setAppName] = useState("FootLock");
  const [appLogo, setAppLogo] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(["Direct Pay", "Split Payment", "Cash"]);
  const [timezone, setTimezone] = useState("GMT");
  const [contactEmail, setContactEmail] = useState("jrdinesh1@gmail.com");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleLogoChange = (e) => {
    setAppLogo(URL.createObjectURL(e.target.files[0]));
  };

  const handlePaymentMethodToggle = (method) => {
    setPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((item) => item !== method) : [...prev, method]
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-black mb-4 text-center shadow-lg p-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Admin Settings
        </h1>
      </div>

      {/* General Settings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">General Settings</h2>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-black">App Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">App Logo</label>
            <input
              type="file"
              onChange={handleLogoChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {appLogo && <img src={appLogo} alt="App Logo" className="mt-2 w-20 h-20 object-cover" />}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            >
              <option value="GMT">GMT</option>
              <option value="UTC">UTC</option>
              <option value="IST">IST</option>
              <option value="PST">PST</option>
              {/* Add more timezones as needed */}
            </select>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">Payment Settings</h2>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-black">Payment Methods</label>
            <div className="flex flex-col space-y-2">
              {["Direct Pay", "Split Payment", "Cash"].map((method) => (
                <div key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={paymentMethods.includes(method)}
                    onChange={() => handlePaymentMethodToggle(method)}
                    className="mr-2"
                  />
                  <span className="text-black">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security & Notification Settings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">Security & Notification Settings</h2>
        <div className="space-y-4 mt-4">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-black">Enable Two-Factor Authentication (2FA)</label>
            <input
              type="checkbox"
              checked={is2FAEnabled}
              onChange={() => setIs2FAEnabled(!is2FAEnabled)}
              className="border border-gray-300 rounded"
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-black">Email Notifications</label>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="border border-gray-300 rounded"
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-black">Push Notifications</label>
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
              className="border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Settings
        </button>
      </div>
    </div>
  );
}
