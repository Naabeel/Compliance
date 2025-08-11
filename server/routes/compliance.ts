import { RequestHandler } from "express";

// Mock data for demonstration
const mockNetworkMembers: { [key: string]: any } = {
  "6023085": {
    name: "Michael Bartikoski",
    biography: "Michael Bartikoski is an executive in the food and beverage industry and is currently serving as COO for CraftMark Bakery, LLC - prior to that he was COO at Diamond Crystal Brands. He was also an interim executive for Rialto Banking Company serving as their VP of Operations.",
    practice_area: "Consumer Goods & Services",
    council_name: "Consumer Goods & Services Council",
    country: "United States",
    linkedin_url: "https://www.linkedin.com/in/michael-bartikoski-12345",
    work_history: [
      {
        company: "CraftMark Bakery, LLC",
        title: "Chief Operating Officer",
        period: "2020-Present"
      },
      {
        company: "Diamond Crystal Brands",
        title: "Chief Operating Officer", 
        period: "2018-2020"
      },
      {
        company: "Rialto Banking Company",
        title: "VP of Operations",
        period: "2015-2018"
      }
    ]
  },
  "12345": {
    name: "Sarah Johnson",
    biography: "Sarah Johnson is a senior technology executive with over 15 years of experience in software development and digital transformation. She currently serves as CTO at TechCorp Industries.",
    practice_area: "Technology & Innovation",
    council_name: "Technology Innovation Council",
    country: "Canada",
    linkedin_url: "https://www.linkedin.com/in/sarah-johnson-67890",
    work_history: [
      {
        company: "TechCorp Industries",
        title: "Chief Technology Officer",
        period: "2021-Present"
      },
      {
        company: "Innovation Labs",
        title: "VP of Engineering",
        period: "2018-2021"
      }
    ]
  }
};

const mockScreeningResults = {
  summary: `
    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-start space-x-3">
        <div class="bg-green-100 rounded-full p-2">
          <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-green-800 mb-2">No Negative News or Legal Issues Found</h3>
          <p class="text-sm text-green-700 mb-4">
            After a comprehensive review of public records, news databases, and legal sources, there is no evidence of any lawsuits,
            controversies, scandals, or legal issues involving this Network Member. Searches covered all known professional tenures
            and industry positions including CraftMark Bakery LLC, Diamond Crystal Brands, and Rialto Banking Company.
          </p>
          <p class="text-sm text-green-700 mb-4">
            All sources confirm that the Network Member has maintained a professional reputation, with no public reports of criminal activity,
            malpractice, fraud, employee lawsuits, or any other negative incidents associated with their name. The screening process
            examined over 150 news sources, legal databases, and regulatory filings.
          </p>
          <div class="bg-white border border-green-200 rounded p-3 mb-4">
            <p class="text-sm font-medium text-green-800 mb-2">Detailed Findings:</p>
            <ul class="text-sm text-green-700 list-disc list-inside space-y-1">
              <li>No criminal records found in federal or state databases</li>
              <li>No civil litigation as defendant in the past 10 years</li>
              <li>No regulatory violations or sanctions</li>
              <li>No negative media coverage or scandals</li>
              <li>No bankruptcy filings or financial misconduct</li>
            </ul>
          </div>
          <div class="bg-white border border-green-200 rounded p-3">
            <p class="text-sm font-medium text-green-800 mb-2">Conclusion:</p>
            <p class="text-sm text-green-700">
              Extensive searches across multiple reputable sources revealed no negative news, legal actions, or controversies.
              The Network Member appears to have a clean professional record with no compliance concerns identified.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  citations: [
    "https://www.beverage-secretions.com/tag/executive-news?utm_source=compliance_search",
    "https://www.beverage.co.uk/newsector/food-beverage-executives-2023?utm_source=compliance_search",
    "https://www.dailymail.co.uk/news/business/food-industry-leaders?utm_source=compliance_search",
    "https://case-law.vlex.com/vid/executive-litigation-search-685221107?utm_source=compliance_search",
    "https://finance.yahoo.com/news/diamond-crystal-brands-leadership-announcements?utm_source=compliance_search",
    "https://www.sec.gov/edgar/search/?q=diamond+crystal+brands&utm_source=compliance_search",
    "https://www.courtlistener.com/search/?q=michael+bartikoski&utm_source=compliance_search",
    "https://www.bloomberg.com/search?query=craftmark+bakery+executives&utm_source=compliance_search",
    "https://www.reuters.com/business/retail-consumer/food-beverage-industry-news/?utm_source=compliance_search",
    "https://www.wsj.com/search?query=food+industry+executives&utm_source=compliance_search",
    "https://www.ftc.gov/enforcement/cases-proceedings/search?combine=food+beverage&utm_source=compliance_search",
    "https://www.justice.gov/search/site/food%20industry%20executives?utm_source=compliance_search"
  ]
};

const mockQueries = [
  '"Network Member" lawsuit United States federal court',
  '"Network Member" fraud investigation SEC enforcement action',
  '"Network Member" arrest criminal charges indictment',
  'Any legal issues involving "Network Member" civil litigation',
  '"Network Member" fined by regulatory agencies FDA USDA',
  '"Network Member" has pending criminal charges prosecution',
  '"Network Member" fined for violations food safety regulations',
  'Were there any scandals involving "Network Member" corporate misconduct',
  'Was there fraud or corruption involving "Network Member" embezzlement',
  'Has "Network Member" faced any malpractice allegations negligence',
  '"Network Member" bankruptcy filing financial misconduct',
  '"Network Member" terminated fired for cause employment',
  '"Network Member" whistleblower complaint ethics violation',
  '"Network Member" insider trading securities violation',
  '"Network Member" discrimination lawsuit hostile workplace',
  '"Network Member" environmental violations EPA citations',
  '"Network Member" tax evasion IRS investigation',
  '"Network Member" antitrust violation price fixing conspiracy',
  '"Network Member" product liability recall safety issues',
  '"Network Member" bribery corruption foreign officials FCPA'
];

// Store for tracking screening status
const screeningStatus: { [key: string]: any } = {};

export const getNMInfo: RequestHandler = (req, res) => {
  const { nm_id } = req.params;
  
  const networkMember = mockNetworkMembers[nm_id];
  
  if (!networkMember) {
    return res.status(404).json({ error: "Network Member not found" });
  }
  
  res.json(networkMember);
};

export const startScreening: RequestHandler = (req, res) => {
  // In a real implementation, this would initiate actual screening
  const nm_id = "6023085"; // Mock ID for demo
  
  // Simulate screening process
  screeningStatus[nm_id] = {
    nm_id,
    status: "Initializing screening process...",
    startTime: Date.now()
  };
  
  // Simulate different status updates
  setTimeout(() => {
    screeningStatus[nm_id].status = "Collecting public records...";
  }, 2000);
  
  setTimeout(() => {
    screeningStatus[nm_id].status = "Analyzing news sources...";
  }, 5000);
  
  setTimeout(() => {
    screeningStatus[nm_id].status = "Summarizing results...";
  }, 8000);
  
  setTimeout(() => {
    screeningStatus[nm_id] = {
      nm_id,
      status: "Completed",
      results: mockScreeningResults
    };
  }, 12000);
  
  res.json({
    message: "Screening started successfully",
    nm_id
  });
};

export const getStatus: RequestHandler = (req, res) => {
  const { nm_id } = req.params;
  
  const status = screeningStatus[nm_id];
  
  if (!status) {
    return res.status(404).json({ error: "Screening not found" });
  }
  
  res.json(status);
};

export const getQueries: RequestHandler = (req, res) => {
  const { nm_id } = req.params;
  
  // In a real implementation, this would fetch actual queries used for the NM
  const queries = mockQueries.map(query => 
    query.replace("Network Member", mockNetworkMembers[nm_id]?.name || "Network Member")
  );
  
  res.json({ queries });
};

export const answerQuery: RequestHandler = (req, res) => {
  const { nm_id, user_query } = req.body;
  
  if (!nm_id || !user_query) {
    return res.status(400).json({ error: "Missing nm_id or user_query" });
  }
  
  // Mock AI response based on query
  let answer = "I understand your question about the screening results. ";
  
  if (user_query.toLowerCase().includes('controversy') || user_query.toLowerCase().includes('negative')) {
    answer += "Based on our comprehensive screening, no controversies or negative news were found regarding this Network Member. All sources confirm a clean professional record.";
  } else if (user_query.toLowerCase().includes('legal') || user_query.toLowerCase().includes('lawsuit')) {
    answer += "Our legal database search revealed no lawsuits, legal issues, or pending cases associated with this Network Member.";
  } else if (user_query.toLowerCase().includes('work') || user_query.toLowerCase().includes('employment')) {
    answer += "The work history verification shows consistent employment at reputable companies with no reported issues or controversies at any of the positions held.";
  } else {
    answer += "Could you please be more specific about what aspect of the screening results you'd like me to clarify? I can provide details about legal issues, work history, or any negative news findings.";
  }
  
  // Simulate some processing delay
  setTimeout(() => {
    res.json({ answer });
  }, 1000);
};
