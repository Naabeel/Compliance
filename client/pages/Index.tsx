import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ExternalLink, Search, UserCheck, FileText, AlertTriangle } from "lucide-react";

// Mock data for Network Member
const networkMemberData = {
  id: "35117",
  name: "Michael Bartikoski",
  country: "United States",
  region: "North America",
  councilName: "Consumer Goods & Services",
  linkedIn: "https://www.linkedin.com/in/michael-bartikoski-12345",
  biography: "Michael Bartikoski is an executive in the food and beverage industry and is currently serving as COO for CraftMark Bakery, LLC - prior to that he was COO at Diamond Crystal Brands. He was also an interim executive for Rialto Banking Company serving as their VP of Operations.",
  workHistory: [
    {
      companyName: "The Hershey Company",
      jobTitle: "VP, Global Manufacturing & Alliances",
      period: "2018-2023"
    },
    {
      companyName: "Diamond Crystal Brands",
      jobTitle: "COO",
      period: "2015-2018"
    },
    {
      companyName: "Coca-Cola Europacific Partners API Pty Ltd",
      jobTitle: "Director, National Business Development",
      period: "2012-2015"
    }
  ]
};

// Mock negative news citations
const negativeNewsCitations = [
  "https://www.beverage-secretions.com/tag/?utm_source=copilot",
  "https://www.beverage.co.uk/newsector/10-43-33072?utm_source=copilot",
  "https://www.dailymail.co.uk/news/article-4450172?utm_source=copilot",
  "https://case-law.vlex.com/vid/685221107?utm_source=copilot",
  "https://finance.yahoo.com/news/diamond-crystal-brands-announces-dc-partners-dc-announce-resignation-of-chief-financial-officer?utm_source=copilot",
  "https://naamloosc.com/name-parties-explained-attorney-clients-or-101?utm_source=copilot"
];

// Mock generated queries
const generatedQueries = [
  '"Michael Bartikoski" lawsuit United States news',
  '"Michael Bartikoski" fraud investigation federal crime in the food and beverage industry?',
  '"Michael Bartikoski" arrest for any controversy?',
  'Any legal issues involving "Michael Bartikoski" at Diamond Crystal Brands',
  '"Michael Bartikoski" fined by employees or partners at The Hershey Company',
  '"Michael Bartikoski" has pending criminal charges in the United States',
  '"Michael Bartikoski" fined for violations at Land O\' Frost operations',
  'Were there any scandals involving "Michael Bartikoski" at The Hershey Company?',
  'Was there fraud or corruption involving "Michael Bartikoski"?',
  'Has "Michael Bartikoski" faced any malpractice allegations as COO at Roskam Foods?',
  '"Michael Bartikoski" prosecution or investigation in relation to his executive roles'
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("negative-news");
  const [showCitations, setShowCitations] = useState(false);
  const [showQueries, setShowQueries] = useState(false);

  const handleStartConversation = () => {
    // This would initiate AI conversation for further investigation
    console.log("Starting AI conversation for further investigation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-compliance-header text-compliance-header-foreground shadow-sm">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs lg:text-sm">
                <ArrowLeft className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Click to go back, hold to see history</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
            <h1 className="text-lg lg:text-xl font-semibold text-center">Negative News Screening Agent</h1>
            <div className="w-16 lg:w-32"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Network Member Details */}
        <aside className="w-full lg:w-80 bg-compliance-sidebar border-r border-gray-200 lg:min-h-screen">
          <div className="p-4 lg:p-6">
            <div className="space-y-6">
              {/* NM Details Header */}
              <div>
                <h2 className="text-lg font-semibold text-compliance-sidebar-foreground mb-4">NM details</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">ID</span>
                    <p className="text-sm text-gray-900">{networkMemberData.id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name</span>
                    <p className="text-sm text-gray-900">{networkMemberData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Country</span>
                    <p className="text-sm text-gray-900">{networkMemberData.country}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Region</span>
                    <p className="text-sm text-gray-900">{networkMemberData.region}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Council Name</span>
                    <p className="text-sm text-gray-900">{networkMemberData.councilName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">LinkedIn</span>
                    <a 
                      href={networkMemberData.linkedIn} 
                      className="text-sm text-compliance-accent hover:underline flex items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Profile <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div>
                <h3 className="text-sm font-semibold text-compliance-sidebar-foreground mb-2">Biography</h3>
                <p className="text-xs text-gray-700 leading-relaxed">{networkMemberData.biography}</p>
              </div>

              {/* Work History */}
              <div>
                <h3 className="text-sm font-semibold text-compliance-sidebar-foreground mb-2">Work History</h3>
                <div className="space-y-3">
                  {networkMemberData.workHistory.map((job, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-3">
                      <div>
                        <span className="text-xs font-medium text-gray-600">Company Name</span>
                        <p className="text-xs text-gray-900">{job.companyName}</p>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs font-medium text-gray-600">Job Title</span>
                        <p className="text-xs text-gray-900">{job.jobTitle}</p>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-gray-600">{job.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl lg:text-2xl font-semibold text-compliance-header mb-4 lg:mb-6">
              Screening Results for {networkMemberData.name}
            </h2>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="identity" className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm">
                  <UserCheck className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Identity Verification</span>
                  <span className="sm:hidden">Identity</span>
                </TabsTrigger>
                <TabsTrigger value="work-history" className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm">
                  <FileText className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Work History</span>
                  <span className="sm:hidden">Work</span>
                </TabsTrigger>
                <TabsTrigger value="negative-news" className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm">
                  <AlertTriangle className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Negative News</span>
                  <span className="sm:hidden">News</span>
                </TabsTrigger>
              </TabsList>

              {/* Identity Verification Tab */}
              <TabsContent value="identity">
                <Card>
                  <CardHeader>
                    <CardTitle>Identity Verification Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Identity verification data will be available in future phases.</p>
                        <p className="text-sm mt-2">This section will contain identity verification results and confidence scores.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Work History Tab */}
              <TabsContent value="work-history">
                <Card>
                  <CardHeader>
                    <CardTitle>Work History Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Work history verification data will be available in future phases.</p>
                        <p className="text-sm mt-2">This section will contain employment verification and validation results.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Negative News Tab */}
              <TabsContent value="negative-news" className="space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowQueries(!showQueries)}
                    className="flex items-center justify-center space-x-2 text-sm"
                  >
                    <Search className="h-4 w-4" />
                    <span>View Generated Queries</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCitations(!showCitations)}
                    className="flex items-center justify-center space-x-2 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Citations</span>
                  </Button>
                  <Button
                    onClick={handleStartConversation}
                    className="bg-compliance-header hover:bg-compliance-accent text-white text-sm"
                  >
                    Start a Conversation
                  </Button>
                </div>

                {/* Generated Queries Modal */}
                {showQueries && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Generated Queries</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowQueries(false)}
                      >
                        ×
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {generatedQueries.map((query, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                              • {query}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {/* Citations Modal */}
                {showCitations && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Citations</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowCitations(false)}
                      >
                        ×
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {negativeNewsCitations.map((citation, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded">
                              <a 
                                href={citation} 
                                className="text-sm text-compliance-accent hover:underline flex items-center"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                • {citation} <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {/* Screening Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Screening Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 rounded-full p-2">
                          <UserCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-800 mb-2">
                            No Negative News or Legal Issues Found Regarding {networkMemberData.name}
                          </h3>
                          <p className="text-sm text-green-700 mb-4">
                            After a comprehensive review of public records, news databases, and legal sources, there is no evidence of any lawsuits, 
                            controversies, scandals, or legal issues involving {networkMemberData.name}. Searches covered his tenures at CraftMark Bakery, 
                            Diamond Crystal Brands, Rialto Banking Company, Summit Foods, The Hershey Company, PepsiCo, Quaker Oats, E. & J. Gallo Winery, and other notable 
                            organizations he has worked for and beverage industry positions.
                          </p>
                          <p className="text-sm text-green-700 mb-4">
                            All sources confirm that {networkMemberData.name} has maintained a professional reputation, with no public reports of criminal activity, 
                            malpractice, fraud, employee lawsuits, or any other negative incidents associated with his name. Any legal cases or 
                            controversies identified in the search pertained to companies he worked for, but not to Bartikoski personally, and often 
                            occurred outside his tenure or without his involvement.
                          </p>
                          <div className="bg-white border border-green-200 rounded p-3">
                            <p className="text-sm font-medium text-green-800 mb-2">Conclusion:</p>
                            <p className="text-sm text-green-700">
                              Extensive searches across multiple reputable sources revealed no negative news, legal actions, or controversies involving 
                              {networkMemberData.name}.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons in Summary */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setShowQueries(!showQueries)}
                        className="flex items-center justify-center space-x-2 text-sm"
                      >
                        <Search className="h-4 w-4" />
                        <span>View Generated Queries</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCitations(!showCitations)}
                        className="flex items-center justify-center space-x-2 text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Citations</span>
                      </Button>
                      <Button
                        onClick={handleStartConversation}
                        className="bg-compliance-header hover:bg-compliance-accent text-white text-sm"
                      >
                        Start a Conversation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
