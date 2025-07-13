import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";

interface LocationState {
  monthlyIncome: string;
  taxFreeBonus: string;
  taxFreeExpenses: string;
  employees?: Array<{
    grossSalary: string;
    taxFreeBonus: string;
  }>;
}

export const ResultsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // If no data, redirect back to calculator
  React.useEffect(() => {
    if (!state?.monthlyIncome) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state?.monthlyIncome) {
    return <div>Loading...</div>;
  }

  // Mock calculations - replace with your actual calculation logic
  const monthlyIncome = parseFloat(state.monthlyIncome) || 0;
  const taxFreeBonus = parseFloat(state.taxFreeBonus) || 0;
  const taxFreeExpenses = parseFloat(state.taxFreeExpenses) || 0;
  
  const grossSalary = monthlyIncome * 0.7; // Example calculation
  const netSalary = grossSalary * 0.85; // Example calculation
  const yearlyProfit = monthlyIncome * 12; // Example calculation
  const corporateTaxes = yearlyProfit * 0.3; // Example calculation
  const yearlyNetProfit = yearlyProfit - corporateTaxes; // Example calculation

  // Temporary placeholder icons - will be replaced with your custom icons
  const GrossSalaryIcon = () => (
    <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
      <span className="text-white text-xs">💳</span>
    </div>
  );

  const YearlyProfitIcon = () => (
    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
      <span className="text-white text-xs">$</span>
    </div>
  );

  const CorporateTaxesIcon = () => (
    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
      <span className="text-white text-xs">📊</span>
    </div>
  );

  const YearlyNetProfitIcon = () => (
    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
      <span className="text-white text-xs">💰</span>
    </div>
  );

  const metrics = [
    {
      title: "Gross Salary",
      value: `MAD ${grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: GrossSalaryIcon,
    },
    {
      title: "Yearly profit",
      value: `MAD ${yearlyProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: YearlyProfitIcon,
    },
    {
      title: "Corporate taxes",
      value: `MAD ${corporateTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: CorporateTaxesIcon,
    },
    {
      title: "Yearly net profit",
      value: `MAD ${yearlyNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: YearlyNetProfitIcon,
    },
  ];

  return (
    <div className="bg-[radial-gradient(ellipse_at_center,rgba(236,253,245,0.4)_0%,rgba(255,255,255,1)_70%)] min-h-screen w-full">
      <div className="w-full min-h-screen pb-16 md:pb-24">
        <div className="flex flex-col w-full items-center relative">
          {/* Header */}
          <header className="flex flex-col items-center gap-2.5 px-0 py-8 relative w-full bg-transparent">
            <div className="inline-flex items-center gap-1.5 relative">
              <div className="relative w-6 h-6">
                <div className="relative w-[25px] h-[25px] -top-px -left-px">
                  <div className="absolute w-[17px] h-[17px] top-1.5 left-1.5 bg-emerald-700 rounded rotate-[-15.00deg]" />
                  <div className="absolute w-[17px] h-[17px] top-0.5 left-0.5 bg-emerald-400 rounded rotate-[-15.00deg]" />
                </div>
              </div>
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-semibold text-neutralneutral-800 text-xl text-center tracking-[0] leading-[24.0px] whitespace-nowrap">
                SoloPay
              </div>
            </div>
          </header>

          <main className="flex flex-col items-center justify-center gap-8 px-4 md:px-8 py-0 relative w-full max-w-4xl mt-8 md:mt-12">
            {/* Back button */}
            <div className="w-full flex justify-start">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-0 h-auto font-normal"
              >
                <ArrowLeft className="w-4 h-4" />
                Calculator
              </Button>
            </div>

            {/* Main Result */}
            <div className="text-center space-y-4 mt-16 w-full max-w-2xl py-5" style={{ backgroundColor: '#F8FAFC', borderRadius: '20px' }}>
              <h1 className="text-gray-600 text-lg font-normal">
                Your Tax-Optimized Salary (Net salary)
              </h1>
              <div className="space-y-2">
                <div className="text-6xl md:text-7xl font-bold text-gray-900">
                  {Math.round(netSalary).toLocaleString()}
                </div>
                <div className="text-xl text-gray-600 font-medium">
                  MAD
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-5 max-w-2xl">
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-6" style={{ backgroundColor: '#F8FAFC', borderRadius: '20px' }}>
                    <div className="flex-shrink-0">
                      <IconComponent />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 text-lg font-medium mb-1">
                        {metric.title}
                      </h3>
                      <p className="text-gray-900 text-lg font-semibold">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};