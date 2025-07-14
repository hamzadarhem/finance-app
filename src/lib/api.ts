export interface EmployeeDto {
  grossSalary: number;
  nonTaxableBonus: number;
}

export interface CalculatorDto {
  companyMonthlyIncome: number;
  nonTaxableBonus: number;
  taxDate: number;
  nonTaxableExpense: number;
  employees: EmployeeDto[];
}

export interface CalculatorResponse {
  status: number;
  message: string;
  data: {
    grossSalary: number;
    netOwnerSalary: number;
    yearlyProfit: number;
    totalTaxes: number;
    netProfit: number;
    profitMarging: number;
  };
}

const API_BASE_URL = 'http://localhost:3000/api';

// Mock calculation function to simulate backend logic
function mockCalculateBestMonthlySimulation(data: CalculatorDto): CalculatorResponse['data'] {
  const { companyMonthlyIncome, nonTaxableBonus, nonTaxableExpense, employees } = data;
  
  // Simple mock calculation logic
  const totalEmployeeSalaries = employees.reduce((sum, emp) => sum + emp.grossSalary, 0);
  const totalEmployeeBonuses = employees.reduce((sum, emp) => sum + emp.nonTaxableBonus, 0);
  
  const grossSalary = companyMonthlyIncome * 0.7; // Mock: 70% of income as gross salary
  const netOwnerSalary = grossSalary - (grossSalary * 0.25); // Mock: 25% tax rate
  const yearlyProfit = (companyMonthlyIncome - totalEmployeeSalaries - nonTaxableExpense) * 12;
  const totalTaxes = grossSalary * 0.25 * 12; // Mock annual taxes
  const netProfit = yearlyProfit - totalTaxes;
  const profitMarging = netProfit / (companyMonthlyIncome * 12) * 100;
  
  return {
    grossSalary,
    netOwnerSalary,
    yearlyProfit,
    totalTaxes,
    netProfit,
    profitMarging
  };
}

export class ApiService {
  static async calculateBestMonthlySimulation(data: CalculatorDto): Promise<CalculatorResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock calculation instead of actual API call
      const calculationResult = mockCalculateBestMonthlySimulation(data);
      
      return {
        status: 200,
        message: 'Calculation completed successfully',
        data: calculationResult
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
} 