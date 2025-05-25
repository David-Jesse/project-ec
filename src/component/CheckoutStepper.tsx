const CheckoutStepper = ({
  steps = ["Billing", "Payment", "Confirmation"],
  currentStep = 0,
}) => {
  return (
    <div className="w-full py-4 sm:py-6">
      {/* Mobile View - Vertical layout */}
      <div className="block sm:hidden">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div className="flex items-center" key={index}>
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full border-2 text-xs font-medium flex-shrink-0 ${
                  index < currentStep
                    ? "bg-amber-500 text-white border-amber-500"
                    : index === currentStep
                      ? "bg-white text-amber-500 border-amber-500"
                      : "bg-gray-200 text-gray-500 border-gray-200"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              <div className="ml-3 flex-1">
                <p
                  className={`text-sm font-medium ${
                    index <= currentStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step}
                </p>
                {index === currentStep && (
                  <p className="text-xs text-gray-500 mt-1">Current Step</p>
                )}
              </div>

              {/* Vertical connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-4 mt-8 w-0.5 h-4 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View - Horizontal layout */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div className="flex items-center flex-1" key={index}>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full border-2 text-sm font-medium ${
                    index < currentStep
                      ? "bg-amber-500 text-white border-amber-500"
                      : index === currentStep
                        ? "bg-white text-amber-500 border-amber-500"
                        : "bg-gray-200 text-gray-500 border-gray-200"
                  }`}
                >
                  {index < currentStep ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="ml-3">
                  <p
                    className={`text-sm font-meduim whitespace-nowrap ${
                      index <= currentStep ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>
                  {index === currentStep && (
                    <p className="text-xs text-blue-500">Current</p>
                  )}
                </div>
              </div>

              {/* Horizontal connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-0.5 w-full ${
                      index < currentStep ? "bg-amber-500" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper;
