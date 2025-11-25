import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calculator,
  PiggyBank,
  Banknote,
  Shield,
  Users,
  Building,
  Scale
} from 'lucide-react';
import { toast } from 'sonner';

// Import Dialogs
import { EMICalculatorDialog } from './EMICalculatorDialog';
import { LoanApplicationDialog } from './LoanApplicationDialog';
import { LoanComparisonDialog } from './LoanComparisonDialog';

interface LoanProduct {
  id: string;
  name: string;
  provider: string;
  type: 'crop-loan' | 'equipment' | 'livestock' | 'personal' | 'business';
  interestRate: number;
  maxAmount: number;
  tenure: number;
  processingFee: number;
  eligibility: string[];
  features: string[];
  documents: string[];
  rating: number;
  approvalTime: string;
}

interface LoanApplication {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  purpose: string;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'disbursed';
  applicationDate: string;
  expectedDisbursal: string;
  progress: number;
}

interface Insurance {
  id: string;
  name: string;
  provider: string;
  type: 'crop' | 'livestock' | 'equipment' | 'life' | 'health';
  premium: number;
  coverage: number;
  features: string[];
  claimRatio: number;
}

interface Investment {
  id: string;
  name: string;
  type: 'mutual-fund' | 'fixed-deposit' | 'bonds' | 'gold' | 'stocks';
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  minInvestment: number;
  lockPeriod: number;
  description: string;
}

const mockLoanProducts: LoanProduct[] = [
  {
    id: '1',
    name: 'Kisan Credit Card (KCC)',
    provider: 'State Bank of India',
    type: 'crop-loan',
    interestRate: 7.0,
    maxAmount: 300000,
    tenure: 12,
    processingFee: 0,
    eligibility: ['Land ownership documents', 'Aadhaar card', 'Bank account'],
    features: ['No collateral up to ₹1.6L', 'Flexible repayment', 'Interest subsidy available'],
    documents: ['Land records', 'Aadhaar', 'PAN', 'Bank statements'],
    rating: 4.5,
    approvalTime: '7-10 days'
  },
  {
    id: '2',
    name: 'Tractor Loan',
    provider: 'HDFC Bank',
    type: 'equipment',
    interestRate: 8.5,
    maxAmount: 1500000,
    tenure: 84,
    processingFee: 1.0,
    eligibility: ['Minimum 2 years farming experience', 'Income proof', 'Land documents'],
    features: ['Up to 85% financing', 'Quick approval', 'Doorstep service'],
    documents: ['Income proof', 'Land records', 'Quotation', 'Bank statements'],
    rating: 4.3,
    approvalTime: '3-5 days'
  },
  {
    id: '3',
    name: 'Dairy Development Loan',
    provider: 'NABARD',
    type: 'livestock',
    interestRate: 6.5,
    maxAmount: 500000,
    tenure: 60,
    processingFee: 0.5,
    eligibility: ['Dairy farming experience', 'Veterinary certificate', 'Land for cattle shed'],
    features: ['Subsidized interest rates', 'Government backing', 'Technical support'],
    documents: ['Project report', 'Land documents', 'Veterinary certificate'],
    rating: 4.7,
    approvalTime: '15-20 days'
  }
];

const mockApplications: LoanApplication[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Kisan Credit Card (KCC)',
    amount: 150000,
    purpose: 'Crop cultivation - Wheat and Rice',
    status: 'under-review',
    applicationDate: '2024-10-25',
    expectedDisbursal: '2024-11-05',
    progress: 65
  },
  {
    id: '2',
    productId: '2',
    productName: 'Tractor Loan',
    amount: 800000,
    purpose: 'Purchase Mahindra 575 DI Tractor',
    status: 'approved',
    applicationDate: '2024-10-20',
    expectedDisbursal: '2024-11-02',
    progress: 90
  }
];

const mockInsurance: Insurance[] = [
  {
    id: '1',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    provider: 'Government of India',
    type: 'crop',
    premium: 2500,
    coverage: 100000,
    features: ['Weather-based claims', 'Quick settlement', 'Government subsidy'],
    claimRatio: 85
  },
  {
    id: '2',
    name: 'Livestock Insurance',
    provider: 'New India Assurance',
    type: 'livestock',
    premium: 1500,
    coverage: 50000,
    features: ['Disease coverage', 'Accident protection', 'Death benefits'],
    claimRatio: 78
  }
];

const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Agriculture Mutual Fund',
    type: 'mutual-fund',
    expectedReturn: 12,
    riskLevel: 'medium',
    minInvestment: 1000,
    lockPeriod: 36,
    description: 'Invest in agriculture and allied sectors for long-term growth'
  },
  {
    id: '2',
    name: 'Kisan Vikas Patra',
    type: 'bonds',
    expectedReturn: 7.5,
    riskLevel: 'low',
    minInvestment: 1000,
    lockPeriod: 124,
    description: 'Government-backed savings scheme with guaranteed returns'
  }
];

export const FinancialAssistance = () => {
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>(mockLoanProducts);
  const [applications, setApplications] = useState<LoanApplication[]>(mockApplications);
  const [insurance, setInsurance] = useState<Insurance[]>(mockInsurance);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);

  // Dialog States
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [selectedLoanForApp, setSelectedLoanForApp] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const handleApplyLoan = (product: LoanProduct) => {
    setSelectedLoanForApp(product.name);
    setShowLoanApplication(true);
  };

  const handleToggleComparison = (productId: string) => {
    if (selectedForComparison.includes(productId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== productId));
    } else {
      if (selectedForComparison.length >= 3) {
        toast.error('You can compare up to 3 loans at a time');
        return;
      }
      setSelectedForComparison(prev => [...prev, productId]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'disbursed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'under-review': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4" />;
      case 'disbursed': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Assistance</h1>
          <p className="text-gray-600 mt-2">Loans, insurance, and investment solutions for farmers</p>
        </div>
        <div className="flex gap-2">
          {selectedForComparison.length > 0 && (
            <Button variant="secondary" onClick={() => setShowComparison(true)}>
              <Scale className="h-4 w-4 mr-2" />
              Compare ({selectedForComparison.length})
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowEMICalculator(true)}>
            <Calculator className="h-4 w-4" />
            EMI Calculator
          </Button>
        </div>
      </div>

      <Tabs defaultValue="loans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="financial-health">Financial Health</TabsTrigger>
        </TabsList>

        <TabsContent value="loans" className="space-y-6">
          <div className="grid gap-6">
            {loanProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedForComparison.includes(product.id)}
                        onCheckedChange={() => handleToggleComparison(product.id)}
                        className="mt-1"
                      />
                      <div>
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Building className="h-4 w-4" />
                          {product.provider}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{product.interestRate}%</div>
                      <div className="text-sm text-gray-600">Interest Rate</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">MAX AMOUNT</Label>
                      <div className="font-semibold">₹{product.maxAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">TENURE</Label>
                      <div className="font-semibold">{product.tenure} months</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">PROCESSING FEE</Label>
                      <div className="font-semibold">{product.processingFee}%</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">APPROVAL TIME</Label>
                      <div className="font-semibold">{product.approvalTime}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <Label className="text-sm font-medium">Key Features:</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {product.features.map((feature, index) => (
                          <Badge key={index} variant="outline">{feature}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Required Documents:</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {product.documents.map((doc, index) => (
                          <Badge key={index} variant="secondary">{doc}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{product.rating}/5</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button onClick={() => handleApplyLoan(product)}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{application.productName}</CardTitle>
                      <CardDescription>Amount: ₹{application.amount.toLocaleString()}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status.replace('-', ' ').toUpperCase()}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">APPLICATION DATE</Label>
                        <div>{new Date(application.applicationDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">EXPECTED DISBURSAL</Label>
                        <div>{new Date(application.expectedDisbursal).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Application Progress</Label>
                        <span className="text-sm text-gray-600">{application.progress}%</span>
                      </div>
                      <Progress value={application.progress} />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {application.status === 'draft' && (
                        <Button size="sm">
                          Continue Application
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <div className="grid gap-4">
            {insurance.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{policy.name}</CardTitle>
                      <CardDescription>{policy.provider}</CardDescription>
                    </div>
                    <Badge>{policy.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">PREMIUM</Label>
                      <div className="font-semibold">₹{policy.premium}/year</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">COVERAGE</Label>
                      <div className="font-semibold">₹{policy.coverage.toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">CLAIM RATIO</Label>
                      <div className="font-semibold">{policy.claimRatio}%</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-sm font-medium">Features:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {policy.features.map((feature, index) => (
                        <Badge key={index} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                    <Button>
                      Buy Policy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6">
          <div className="grid gap-4">
            {investments.map((investment) => (
              <Card key={investment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{investment.name}</CardTitle>
                      <CardDescription>{investment.description}</CardDescription>
                    </div>
                    <Badge variant={investment.riskLevel === 'low' ? 'default' :
                      investment.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                      {investment.riskLevel} risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500">EXPECTED RETURN</Label>
                      <div className="font-semibold text-green-600">{investment.expectedReturn}%</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">MIN INVESTMENT</Label>
                      <div className="font-semibold">₹{investment.minInvestment.toLocaleString()}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">LOCK PERIOD</Label>
                      <div className="font-semibold">{investment.lockPeriod} months</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">TYPE</Label>
                      <div className="font-semibold">{investment.type.replace('-', ' ')}</div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button>
                      <PiggyBank className="h-4 w-4 mr-2" />
                      Start Investment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial-health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Financial Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">750</div>
                  <div className="text-sm text-gray-600 mb-4">Good Financial Health</div>
                  <Progress value={75} className="mb-4" />
                  <div className="text-xs text-gray-500">Based on income, expenses, and credit history</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Monthly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Income</span>
                    <span className="font-semibold text-green-600">₹45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Expenses</span>
                    <span className="font-semibold text-red-600">₹32,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan EMIs</span>
                    <span className="font-semibold">₹8,500</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="font-semibold">Net Savings</span>
                    <span className="font-semibold text-green-600">₹4,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Increase Emergency Fund</h4>
                    <p className="text-sm text-blue-700">Build an emergency fund of ₹1.5L (3-6 months expenses)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Consider Crop Insurance</h4>
                    <p className="text-sm text-green-700">Protect your crops with PMFBY insurance scheme</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Diversify Income</h4>
                    <p className="text-sm text-yellow-700">Consider allied activities like dairy or poultry farming</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EMICalculatorDialog
        open={showEMICalculator}
        onOpenChange={setShowEMICalculator}
      />
      <LoanApplicationDialog
        open={showLoanApplication}
        onOpenChange={setShowLoanApplication}
        productName={selectedLoanForApp}
      />
      <LoanComparisonDialog
        open={showComparison}
        onOpenChange={setShowComparison}
        selectedLoans={loanProducts.filter(p => selectedForComparison.includes(p.id))}
      />
    </div>
  );
};
