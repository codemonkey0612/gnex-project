"use client";

interface WizardStepsProps {
  steps: string[];
  currentStep: number;
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-2 border-primary bg-background text-primary"
                        : "border-2 border-muted bg-background text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs ${
                    isCurrent
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
