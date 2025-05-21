
export interface CheckoutStepperProps {
  steps: string[];
  currentStep: number;
}
const CheckoutStepper = ({ steps, currentStep }: CheckoutStepperProps) => {
    return (
        <div className="w-full py-6">
            <div className='flex items-center'>
                {steps.map((step, index) => (
                    <div className='flex items-center' key={index}>
                        <div
                            className={`flex items-center justify-center h-10 w-10 rounded-full border-2 text-sm font-medium ${index < currentStep
                                ? "bg-blue-600 text-whote border-blue-600" // Completed
                                : index === currentStep
                                    ? "border-blue-600 text-blue-600" // Current
                                    : "border-gray-300 text-gray-400" // Upcoming
                                }`}
                        >
                            {index < currentStep ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                index + 1
                            )}
                        </div>

                        {/* label */}
                        <div className="ml-2 mr-8">
                            <p className={`text-sm font-medium ${index <= currentStep ? "text-gray-900" : "text-gray-500"}`}>
                                {step}
                            </p>
                        </div>

                        {index < step.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 w-16 ${index < currentStep ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CheckoutStepper