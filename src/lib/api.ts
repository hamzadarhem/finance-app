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

export class ApiService {
  static async calculateBestMonthlySimulation(data: CalculatorDto): Promise<CalculatorResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/calculator/best-monthly-simulation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
} 