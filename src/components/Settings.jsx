import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../db/database';
import { Save } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        companyName: '',
        companyAddress: '',
        logoBase64: '',
        emailService: 'mailto', // mailto or gmail_api
        gmailToken: '',
        offerTemplate: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        const companyName = DatabaseService.getSetting('companyName') || '';
        const companyAddress = DatabaseService.getSetting('companyAddress') || '';
        const logoBase64 = DatabaseService.getSetting('logoBase64') || '';
        const emailService = DatabaseService.getSetting('emailService') || 'mailto';
        const gmailToken = DatabaseService.getSetting('gmailToken') || '';
        const offerTemplate = DatabaseService.getSetting('offerTemplate') || `Date: {{Date}}

To,
{{Name}}

Subject: Offer of Employment - {{Role}}

Dear {{Name}},

We are pleased to offer you the position of {{Role}} at {{CompanyName}}. We were impressed with your qualifications and believe you will be a valuable asset to our team.

**Position Details:**
- Designation: {{Role}}
- Employment Type: {{Type}}
- Start Date: {{StartDate}}
- CTC (Annual): {{Salary}} ({{AmountInWords}})

You will be expected to carry out the duties and responsibilities as described in the job description.

We look forward to welcoming you to {{CompanyName}}.

Sincerely,

Authorized Signatory
{{CompanyName}}`;

        setSettings({ companyName, companyAddress, logoBase64, emailService, gmailToken, offerTemplate });
        setLoading(false);
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings({ ...settings, logoBase64: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        DatabaseService.saveSetting('companyName', settings.companyName);
        DatabaseService.saveSetting('companyAddress', settings.companyAddress);
        DatabaseService.saveSetting('logoBase64', settings.logoBase64);
        DatabaseService.saveSetting('emailService', settings.emailService);
        DatabaseService.saveSetting('gmailToken', settings.gmailToken);
        DatabaseService.saveSetting('offerTemplate', settings.offerTemplate);

        // Auto-save the DB file if possible
        DatabaseService.saveDatabase().then(() => {
            alert('Settings saved successfully!');
        });
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Details */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">Company Details</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            name="companyName"
                            value={settings.companyName}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ex: Acme Corp"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            name="companyAddress"
                            value={settings.companyAddress}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 h-24 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="123 Business Rd, Tech City..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {settings.logoBase64 && (
                            <div className="mt-2 border p-2 rounded w-fit">
                                <img src={settings.logoBase64} alt="Company Logo" className="h-20 object-contain" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Email Settings */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-indigo-600">Email Configuration</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Service</label>
                        <select
                            name="emailService"
                            value={settings.emailService}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 bg-white"
                        >
                            <option value="mailto">Desktop Email Client (mailto:)</option>
                            <option value="gmail_api">Gmail API (Advanced)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            'mailto' opens your default email app. 'Gmail API' requires a valid access token.
                        </p>
                    </div>

                    {settings.emailService === 'gmail_api' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gmail Access Token</label>
                            <input
                                name="gmailToken"
                                type="password"
                                value={settings.gmailToken}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="OAuth2 Access Token"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center shadow"
                >
                    <Save className="w-5 h-5 mr-2" /> Save Configuration
                </button>
            </div>
        </div>
    );
}
