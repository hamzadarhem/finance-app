import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { ApiService, CalculatorDto } from "../../lib/api";

// Form field data for mapping
const formFields = [
  {
    id: "monthly-income",
    label: "Monthly income",
    placeholder: "Ex: 50000",
  },
  {
    id: "tax-free-bonus",
    label: "Tax-free bonus",
    placeholder: "Ex: 3000",
  },
  {
    id: "tax-free-expenses",
    label: "Tax-free expenses",
    placeholder: "Ex: 12000",
  },
  {
    id: "employee-gross-salary",
    label: "Employee's gross salary",
    placeholder: "Ex: 3000",
  },
  {
    id: "employee-tax-free-bonus",
    label: "Employee's tax-free bonus",
    placeholder: "Ex: 3000",
  },
];

export const DivWrapper = (): JSX.Element => {
  const [hasEmployees, setHasEmployees] = useState(true);
  const [employeeCount, setEmployeeCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    taxFreeBonus: "",
    taxFreeExpenses: "",
    employees: [{ grossSalary: "", taxFreeBonus: "" }]
  });
  const navigate = useNavigate();

  const addEmployee = () => {
    setEmployeeCount(prev => prev + 1);
    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, { grossSalary: "", taxFreeBonus: "" }]
    }));
  };

  const handleInputChange = (field: string, value: string, employeeIndex?: number) => {
    if (employeeIndex !== undefined) {
      setFormData(prev => ({
        ...prev,
        employees: prev.employees.map((emp, index) => 
          index === employeeIndex 
            ? { ...emp, [field]: value }
            : emp
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const isFormValid = () => {
    return formData.monthlyIncome.trim() !== "" && 
           formData.taxFreeBonus.trim() !== "" && 
           formData.taxFreeExpenses.trim() !== "";
  };

  const handleCalculate = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields (Monthly income, Tax-free bonus, and Tax-free expenses)");
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare data for API
      const apiData: CalculatorDto = {
        companyMonthlyIncome: parseFloat(formData.monthlyIncome),
        nonTaxableBonus: parseFloat(formData.taxFreeBonus),
        taxDate: new Date().getFullYear(),
        nonTaxableExpense: parseFloat(formData.taxFreeExpenses),
        employees: hasEmployees ? formData.employees.map(emp => ({
          grossSalary: parseFloat(emp.grossSalary),
          nonTaxableBonus: parseFloat(emp.taxFreeBonus)
        })) : []
      };

      // Call the API
      const response = await ApiService.calculateBestMonthlySimulation(apiData);
      
      // Navigate to results page with API response
      navigate("/results", { 
        state: {
          apiResponse: response.data,
          formData: {
            monthlyIncome: formData.monthlyIncome,
            taxFreeBonus: formData.taxFreeBonus,
            taxFreeExpenses: formData.taxFreeExpenses,
            employees: hasEmployees ? formData.employees : undefined
          }
        }
      });
    } catch (error) {
      console.error('Calculation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error calculating results: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (field: typeof formFields[0], index?: number) => (
    <div className="flex flex-col items-start gap-2 flex-1 min-w-0 w-full">
      <label className="font-label-small font-[number:var(--label-small-font-weight)] text-[#101828] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)]">
        {field.label}
      </label>
      <div className="flex h-12 items-center justify-center relative w-full bg-white rounded-xl overflow-hidden border border-solid border-[#d1d5dc] focus-within:border-[#000000] focus-within:border-2 cursor-text">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-0 relative flex-shrink-0">
          <div className="inline-flex items-center gap-1 relative">
            <div className="relative w-fit font-sob-font-paragraph-x-small font-[number:var(--sob-font-paragraph-x-small-font-weight)] text-[#0b1f32] text-[length:var(--sob-font-paragraph-x-small-font-size)] text-center tracking-[var(--sob-font-paragraph-x-small-letter-spacing)] leading-[var(--sob-font-paragraph-x-small-line-height)] whitespace-nowrap">
              MAD
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2.5 px-3 py-0 relative flex-1 border-l border-[#d1d5dc]">
          <Input
            className="border-none shadow-none h-full px-0 text-[#6a7282] font-paragraph-small font-[number:var(--paragraph-small-font-weight)] text-[length:var(--paragraph-small-font-size)] tracking-[var(--paragraph-small-letter-spacing)] leading-[var(--paragraph-small-line-height)] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={field.placeholder}
            value={
              index !== undefined 
                ? (field.id === "employee-gross-salary" ? formData.employees[index]?.grossSalary || "" : formData.employees[index]?.taxFreeBonus || "")
                : (formData as any)[field.id.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())] || ""
            }
            onChange={(e) => {
              const fieldKey = field.id === "employee-gross-salary" ? "grossSalary" : 
                              field.id === "employee-tax-free-bonus" ? "taxFreeBonus" :
                              field.id.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
              handleInputChange(fieldKey, e.target.value, index);
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[radial-gradient(ellipse_at_center,rgba(236,253,245,0.4)_0%,rgba(255,255,255,1)_70%)] min-h-screen w-full">
      <div className="w-full min-h-screen pb-16 md:pb-24">
        <div className="flex flex-col w-full items-center relative">
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

          <main className="flex flex-col items-center justify-center gap-8 px-4 md:px-8 py-0 relative w-full max-w-6xl mt-8 md:mt-12">
            <h1 className="relative max-w-4xl bg-[linear-gradient(154deg,rgba(6,78,59,1)_0%,rgba(52,211,153,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [font-family:'Inter',Helvetica] font-semibold text-2xl md:text-4xl lg:text-5xl text-center tracking-[0] leading-tight">
              Built for Solo Entrepreneurs Who Want to Get Paid Right.
            </h1>
            
            <p className="relative max-w-3xl [font-family:'Inter',Helvetica] font-normal text-gray-600 text-lg md:text-xl text-center tracking-[0] leading-relaxed">
              A salary calculated to strike the perfect balance between what you earn and what you keep.
            </p>

            <Card className="flex flex-col items-start gap-6 md:gap-8 p-6 md:p-8 relative w-full bg-white rounded-3xl overflow-hidden shadow-[0px_0px_16px_8px_#0000000a,0px_0px_0px_2px_#10b98133] mt-8 md:mt-12">
              <CardContent className="p-0 w-full space-y-6 md:space-y-8">
                {/* Mobile: Vertical layout, Desktop: Horizontal layout */}
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
                  {renderInputField(formFields[0])}
                  {renderInputField(formFields[1])}
                  {renderInputField(formFields[2])}
                  
                  {/* Calculate button - full width on mobile, auto on desktop */}
                  <div className="flex flex-col items-start gap-2 flex-shrink-0 w-full md:w-auto">
                    <div className="hidden md:block h-[18px]"></div> {/* Spacer to align with inputs on desktop */}
                    <Button 
                      onClick={handleCalculate}
                      disabled={isLoading || !isFormValid()}
                      className="h-12 px-8 w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl font-heading-x-small font-[number:var(--heading-x-small-font-weight)] text-[length:var(--heading-x-small-font-size)] tracking-[var(--heading-x-small-letter-spacing)] leading-[var(--heading-x-small-line-height)] whitespace-nowrap"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Calculating with AI...
                        </div>
                      ) : (
                        "Calculate"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Employee toggle */}
                <div className="flex items-center gap-5 py-2 w-full md:mt-5">
                  <div className="relative flex-1 [font-family:'Inter',Helvetica] font-medium text-neutralneutral-900 text-sm tracking-[0] leading-[19.6px]">
                    You have employees ?
                  </div>
                  <div className="inline-flex flex-col items-start gap-2.5 relative flex-shrink-0">
                    <Switch
                      checked={hasEmployees}
                      onCheckedChange={setHasEmployees}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                </div>

                {hasEmployees && (
                  <>
                    {/* Employee fields */}
                    {Array.from({ length: employeeCount }, (_, index) => (
                      <div key={`employee-${index}`} className="space-y-6">
                        {index > 0 && (
                          <div className="flex items-center gap-4 w-full">
                            <div className="h-px bg-gray-200 flex-1" />
                            <span className="text-sm text-gray-500 px-4">Employee {index + 1}</span>
                            <div className="h-px bg-gray-200 flex-1" />
                          </div>
                        )}
                        
                        {/* Mobile: Vertical, Desktop: Horizontal employee fields */}
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
                          {renderInputField(formFields[3], index)}
                          {renderInputField(formFields[4], index)}
                          <div className="hidden md:block flex-1"></div> {/* Spacer for desktop */}
                          <div className="hidden md:block flex-shrink-0 w-[140px]"></div> {/* Spacer for button alignment on desktop */}
                        </div>
                      </div>
                    ))}

                    {/* Add employee button */}
                    <div className="flex justify-start w-full">
                      <Button
                        variant="ghost"
                        onClick={addEmployee}
                        className="h-9 px-0 py-3 justify-start gap-2 font-label-x-small font-[number:var(--label-x-small-font-weight)] text-neutralneutral-900 text-[length:var(--label-x-small-font-size)] tracking-[var(--label-x-small-letter-spacing)] leading-[var(--label-x-small-line-height)]"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Add another employee
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};