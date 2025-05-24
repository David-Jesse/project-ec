import { useState, useRef } from "react";
import { motion } from "framer-motion";

// Move InputField outside the main component
const InputField = ({ label, name, type = "text", placeholder, required = false, value, onChange, error }) => {
    return (
        <div className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`mt-1 block w-full rounded-md border ${error ? "border-red-300" : "border-gray-300"
                    } shadow-sm py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

const BillingDetailsForm = ({ billingDetails, onSubmit }) => {
    const [formData, setFormData] = useState(billingDetails || {
        name: "",
        email: "",
        phone: "",
        address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "US",
        },
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s+/g, ""))) {
            newErrors.phone = "Phone number is invalid";
        }

        if (!formData.address.line1.trim()) {
            newErrors["address.line1"] = "Address line 1 is required";
        }

        if (!formData.address.city.trim()) {
            newErrors["address.city"] = "City is required";
        }

        if (!formData.address.state.trim()) {
            newErrors["address.state"] = "State is required";
        }

        if (!formData.address.postal_code.trim()) {
            newErrors["address.postal_code"] = "Postal code is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    // Helper function to get nested values
    const getValue = (name) => {
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            return formData[parent] ? formData[parent][child] || "" : "";
        }
        return formData[name] || "";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-semibold text-gray-800">Billing Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <InputField
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={getValue("name")}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={getValue("email")}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <InputField
                        label="Phone Number"
                        name="phone"
                        placeholder="+1 (555) 123-4567"
                        type="tel"
                        value={getValue("phone")}
                        onChange={handleChange}
                        error={errors.phone}
                    />
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>

                    <div className="space-y-4">
                        <InputField
                            label="Address Line 1"
                            name="address.line1"
                            placeholder="123 Main St."
                            required
                            value={getValue("address.line1")}
                            onChange={handleChange}
                            error={errors["address.line1"]}
                        />

                        <InputField
                            label="Address Line 2"
                            name="address.line2"
                            placeholder="Apt 4B (Optional)"
                            value={getValue("address.line2")}
                            onChange={handleChange}
                            error={errors["address.line2"]}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="City"
                                name="address.city"
                                placeholder="San Francisco"
                                required
                                value={getValue("address.city")}
                                onChange={handleChange}
                                error={errors["address.city"]}
                            />

                            <InputField
                                label="State / Province"
                                name="address.state"
                                placeholder="CA"
                                required
                                value={getValue("address.state")}
                                onChange={handleChange}
                                error={errors["address.state"]}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Postal Code"
                                name="address.postal_code"
                                placeholder="94103"
                                required
                                value={getValue("address.postal_code")}
                                onChange={handleChange}
                                error={errors["address.postal_code"]}
                            />

                            <div className="space-y-1">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="country"
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                </select>
                                {errors["address.country"] && (
                                    <p className="mt-1 text-sm text-red-600">{errors["address.country"]}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Continue to Payment
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default BillingDetailsForm;