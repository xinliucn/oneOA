export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
  if (config.mockEnabled) {
    const mockData = {
    "data": [
        {
            "id": "99",
            "osid": "1",
            "count": "3",
            "matching": "Group DOA|Group DOA",
            "FolderTitle": "Group DOA",
            "FolderDescription": "Group DOA"
        },
        {
            "id": "100",
            "osid": "2",
            "count": "6",
            "matching": "Group Financial Control Policies|Group Financial Control Policies",
            "FolderTitle": "Group Financial Control Policies",
            "FolderDescription": "Group Financial Control Policies"
        },
        {
            "id": "101",
            "osid": "3",
            "count": "23",
            "matching": "PRC Food - Finance Policies|PRC Food - Finance Policies",
            "FolderTitle": "PRC Food - Finance Policies",
            "FolderDescription": "PRC Food - Finance Policies"
        },
        {
            "id": "102",
            "osid": "4",
            "count": "1",
            "matching": "Anti-money Laundering Policy|Anti-money Laundering Policy",
            "FolderTitle": "Anti-money Laundering Policy",
            "FolderDescription": "Anti-money Laundering Policy"
        },
        {
            "id": "103",
            "osid": "5",
            "count": "1",
            "matching": "Tai Luen Coffee - DOA|maping group 20180808",
            "FolderTitle": "Tai Luen Coffee - DOA",
            "FolderDescription": "maping group 20180808"
        },
        {
            "id": "104",
            "osid": "6",
            "count": "11",
            "matching": "Integrated Market Services (Philippines) - Finance Policies|Integrated Market Services (Philippines) - Finance Policies",
            "FolderTitle": "Integrated Market Services (Philippines) - Finance Policies",
            "FolderDescription": "Integrated Market Services (Philippines) - Finance Policies"
        },
        {
            "id": "105",
            "osid": "7",
            "count": "29",
            "matching": "中国食品SOP|中国食品SOP",
            "FolderTitle": "中国食品SOP",
            "FolderDescription": "中国食品SOP"
        },
        {
            "id": "106",
            "osid": "8",
            "count": "1",
            "matching": "Auriga & IMSA Group – Finance Policies|Auriga & IMSA Group – Finance Policies",
            "FolderTitle": "Auriga & IMSA Group – Finance Policies",
            "FolderDescription": "Auriga & IMSA Group – Finance Policies"
        },
        {
            "id": "107",
            "osid": "9",
            "count": "4",
            "matching": "Group Business Record Keeping Guidelines|Group Business Record Keeping Guidelines",
            "FolderTitle": "Group Business Record Keeping Guidelines",
            "FolderDescription": "Group Business Record Keeping Guidelines"
        },
        {
            "id": "108",
            "osid": "10",
            "count": "8",
            "matching": "IMSA - Finance Policies|Change name = IMSA - Finance Policies 20180807\r\nmaping group 20180808",
            "FolderTitle": "IMSA - Finance Policies",
            "FolderDescription": "Change name = IMSA - Finance Policies 20180807\r\nmaping group 20180808"
        },
        {
            "id": "109",
            "osid": "11",
            "count": "1",
            "matching": "Special Purpose Vehicle (SPV) Management Rules|Special Purpose Vehicle (SPV) Management Rules",
            "FolderTitle": "Special Purpose Vehicle (SPV) Management Rules",
            "FolderDescription": "Special Purpose Vehicle (SPV) Management Rules"
        },
        {
            "id": "110",
            "osid": "12",
            "count": "1",
            "matching": "Tai Luen Coffee - Finance Policies|Change name = Tai Luen Coffee - Finance Policies 20180807\r\nmaping group 20180808",
            "FolderTitle": "Tai Luen Coffee - Finance Policies",
            "FolderDescription": "Change name = Tai Luen Coffee - Finance Policies 20180807\r\nmaping group 20180808"
        },
        {
            "id": "111",
            "osid": "13",
            "count": "0",
            "matching": "LF Asia Marketing (Indonesia) - Finance Policies|LF Asia Marketing (Indonesia) - Finance Policies",
            "FolderTitle": "LF Asia Marketing (Indonesia) - Finance Policies",
            "FolderDescription": "LF Asia Marketing (Indonesia) - Finance Policies"
        },
        {
            "id": "112",
            "osid": "14",
            "count": "6",
            "matching": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies|DCH Auriga & JDH Marketing (Thailand) - Finance Policies",
            "FolderTitle": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies",
            "FolderDescription": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies"
        },
        {
            "id": "113",
            "osid": "15",
            "count": "1",
            "matching": "HK Food Mart - DOA|Change name = HK Food Mart - DOA 20180807\r\nmaping 20180808",
            "FolderTitle": "HK Food Mart - DOA",
            "FolderDescription": "Change name = HK Food Mart - DOA 20180807\r\nmaping 20180808"
        },
        {
            "id": "114",
            "osid": "16",
            "count": "0",
            "matching": "DCH Auriga (Borneo) - Finance Policies|DCH Auriga (Borneo) - Finance Policies",
            "FolderTitle": "DCH Auriga (Borneo) - Finance Policies",
            "FolderDescription": "DCH Auriga (Borneo) - Finance Policies"
        },
        {
            "id": "115",
            "osid": "17",
            "count": "0",
            "matching": "DCH CP - Finance Policies|Change name =  DCH CP - Finance Policies 20180807\r\nmaping 20180808",
            "FolderTitle": "DCH CP - Finance Policies",
            "FolderDescription": "Change name =  DCH CP - Finance Policies 20180807\r\nmaping 20180808"
        },
        {
            "id": "116",
            "osid": "18",
            "count": "2",
            "matching": "FMP - Finance Policies|Change name = FMP - Finance Policies 20180807\r\nMaping 20180808",
            "FolderTitle": "FMP - Finance Policies",
            "FolderDescription": "Change name = FMP - Finance Policies 20180807\r\nMaping 20180808"
        },
        {
            "id": "117",
            "osid": "19",
            "count": "1",
            "matching": "HK Food Mart - Finance Policies|Change name = HK Food Mart - Finance Policies 20180807\r\nMaping Group 20180808",
            "FolderTitle": "HK Food Mart - Finance Policies",
            "FolderDescription": "Change name = HK Food Mart - Finance Policies 20180807\r\nMaping Group 20180808"
        },
        {
            "id": "118",
            "osid": "20",
            "count": "0",
            "matching": "DCH Contract Manufacturing - Finance Policies|DCH Contract Manufacturing - Finance Policies",
            "FolderTitle": "DCH Contract Manufacturing - Finance Policies",
            "FolderDescription": "DCH Contract Manufacturing - Finance Policies"
        },
        {
            "id": "119",
            "osid": "21",
            "count": "3",
            "matching": "Group Taxation Policies|Group Taxation Policies",
            "FolderTitle": "Group Taxation Policies",
            "FolderDescription": "Group Taxation Policies"
        },
        {
            "id": "120",
            "osid": "22",
            "count": "1",
            "matching": "Sims Trading - Finance Policies|Change name = Sims Trading - Finance Policies 20180807\r\nmaping group 20180808",
            "FolderTitle": "Sims Trading - Finance Policies",
            "FolderDescription": "Change name = Sims Trading - Finance Policies 20180807\r\nmaping group 20180808"
        },
        {
            "id": "121",
            "osid": "23",
            "count": "7",
            "matching": "DCH (Japan) Group - Finance Policies|Change name = DCH (Japan) Group - Finance Policies 20180807\r\nMaping group 20180808",
            "FolderTitle": "DCH (Japan) Group - Finance Policies",
            "FolderDescription": "Change name = DCH (Japan) Group - Finance Policies 20180807\r\nMaping group 20180808"
        },
        {
            "id": "122",
            "osid": "24",
            "count": "2",
            "matching": "HK Food Trading - Finance Policies|Change name  = HK Food Trading - Finance Policies 20180807\r\nmaping group 20180808",
            "FolderTitle": "HK Food Trading - Finance Policies",
            "FolderDescription": "Change name  = HK Food Trading - Finance Policies 20180807\r\nmaping group 20180808"
        },
        {
            "id": "123",
            "osid": "25",
            "count": "0",
            "matching": "DCH Auriga & IMSA (Malaysia) - Finance Policies|DCH Auriga & IMSA (Malaysia) - Finance Policies",
            "FolderTitle": "DCH Auriga & IMSA (Malaysia) - Finance Policies",
            "FolderDescription": "DCH Auriga & IMSA (Malaysia) - Finance Policies"
        },
        {
            "id": "124",
            "osid": "26",
            "count": "1",
            "matching": "Group Treasury Policies|Group Treasury Policies",
            "FolderTitle": "Group Treasury Policies",
            "FolderDescription": "Group Treasury Policies"
        },
        {
            "id": "125",
            "osid": "27",
            "count": "1",
            "matching": "Sims Trading - DOA|maping group20180809",
            "FolderTitle": "Sims Trading - DOA",
            "FolderDescription": "maping group20180809"
        },
        {
            "id": "126",
            "osid": "28",
            "count": "1",
            "matching": "Group Financial System Policies|Group Financial System Policies",
            "FolderTitle": "Group Financial System Policies",
            "FolderDescription": "Group Financial System Policies"
        },
        {
            "id": "127",
            "osid": "29",
            "count": "0",
            "matching": "DCH Auriga (Singapore) - Finance Policies|DCH Auriga (Singapore) - Finance Policies",
            "FolderTitle": "DCH Auriga (Singapore) - Finance Policies",
            "FolderDescription": "DCH Auriga (Singapore) - Finance Policies"
        },
        {
            "id": "128",
            "osid": "30",
            "count": "15",
            "matching": "UAT GIT folder|UAT GIT - 2021.01.04",
            "FolderTitle": "UAT GIT folder",
            "FolderDescription": "UAT GIT - 2021.01.04"
        },
        {
            "id": "129",
            "osid": "31",
            "count": "6",
            "matching": "UAT GIT folder02|UAT GIT folder02",
            "FolderTitle": "UAT GIT folder02",
            "FolderDescription": "UAT GIT folder02"
        },
        {
            "id": "130",
            "osid": "32",
            "count": "0",
            "matching": "SIMS UAT folder|SIMS UAT folder",
            "FolderTitle": "SIMS UAT folder",
            "FolderDescription": "SIMS UAT folder"
        },
        {
            "id": "131",
            "osid": "33",
            "count": "0",
            "matching": "DCH Auriga UAT folder|DCH Auriga UAT folder",
            "FolderTitle": "DCH Auriga UAT folder",
            "FolderDescription": "DCH Auriga UAT folder"
        },
        {
            "id": "132",
            "osid": "34",
            "count": "0",
            "matching": "PRC Food UAT folder|PRC Food UAT folder",
            "FolderTitle": "PRC Food UAT folder",
            "FolderDescription": "PRC Food UAT folder"
        },
        {
            "id": "133",
            "osid": "35",
            "count": "1",
            "matching": "SIMS Admin UAT folder|SIMS Admin UAT folder",
            "FolderTitle": "SIMS Admin UAT folder",
            "FolderDescription": "SIMS Admin UAT folder"
        },
        {
            "id": "134",
            "osid": "36",
            "count": "7",
            "matching": "GFN Fin Control UAT folder|GFN Fin Control UAT folder",
            "FolderTitle": "GFN Fin Control UAT folder",
            "FolderDescription": "GFN Fin Control UAT folder"
        },
        {
            "id": "135",
            "osid": "37",
            "count": "15",
            "matching": "GIT UAT ABC|GIT UAT ABC GIT UAT ABC GIT UAT ABC",
            "FolderTitle": "GIT UAT ABC",
            "FolderDescription": "GIT UAT ABC GIT UAT ABC GIT UAT ABC"
        },
        {
            "id": "136",
            "osid": "38",
            "count": "0",
            "matching": "New ePolicy Folder|New ePolicy Folder - GIT users",
            "FolderTitle": "New ePolicy Folder",
            "FolderDescription": "New ePolicy Folder - GIT users"
        },
        {
            "id": "137",
            "osid": "39",
            "count": "0",
            "matching": "Audit Log Test|Audit Log Test",
            "FolderTitle": "Audit Log Test",
            "FolderDescription": "Audit Log Test"
        },
        {
            "id": "138",
            "osid": "40",
            "count": "3",
            "matching": "Group Information Technology Policies (Internal)|Group Information Technology Policies (Internal)",
            "FolderTitle": "Group Information Technology Policies (Internal)",
            "FolderDescription": "Group Information Technology Policies (Internal)"
        },
        {
            "id": "139",
            "osid": "41",
            "count": "0",
            "matching": "Testing Testing|Testing Testing",
            "FolderTitle": "Testing Testing",
            "FolderDescription": "Testing Testing"
        },
        {
            "id": "140",
            "osid": "42",
            "count": "0",
            "matching": "rachel test|test",
            "FolderTitle": "rachel test",
            "FolderDescription": "test"
        },
        {
            "id": "141",
            "osid": "43",
            "count": "0",
            "matching": "new folder|test",
            "FolderTitle": "new folder",
            "FolderDescription": "test"
        },
        {
            "id": "142",
            "osid": "44",
            "count": "0",
            "matching": "Demo Folder 01|This folder is for demo only",
            "FolderTitle": "Demo Folder 01",
            "FolderDescription": "This folder is for demo only"
        },
        {
            "id": "143",
            "osid": "45",
            "count": "1",
            "matching": "Demo Folder|This folder is for ePolicy demo only",
            "FolderTitle": "Demo Folder",
            "FolderDescription": "This folder is for ePolicy demo only"
        },
        {
            "id": "144",
            "osid": "46",
            "count": "3",
            "matching": "GIT demo|testing purpose",
            "FolderTitle": "GIT demo",
            "FolderDescription": "testing purpose"
        },
        {
            "id": "145",
            "osid": "47",
            "count": "1",
            "matching": "Cantonese Session Training|This folder is for Cantonese Session of ePolicy Training",
            "FolderTitle": "Cantonese Session Training",
            "FolderDescription": "This folder is for Cantonese Session of ePolicy Training"
        },
        {
            "id": "146",
            "osid": "48",
            "count": "1",
            "matching": "Testing Folder|Testing Folder",
            "FolderTitle": "Testing Folder",
            "FolderDescription": "Testing Folder"
        },
        {
            "id": "147",
            "osid": "49",
            "count": "0",
            "matching": "Testing Folder 01|Testing Folder 01",
            "FolderTitle": "Testing Folder 01",
            "FolderDescription": "Testing Folder 01"
        },
        {
            "id": "148",
            "osid": "50",
            "count": "0",
            "matching": "Testing Folder 02|Testing Folder 02",
            "FolderTitle": "Testing Folder 02",
            "FolderDescription": "Testing Folder 02"
        },
        {
            "id": "149",
            "osid": "51",
            "count": "2",
            "matching": "Group Human Resources Policies|Group Human Resources Policies",
            "FolderTitle": "Group Human Resources Policies",
            "FolderDescription": "Group Human Resources Policies"
        },
        {
            "id": "150",
            "osid": "52",
            "count": "2",
            "matching": "TestForBUCompanyUsers|Test For BU&Company&Users",
            "FolderTitle": "TestForBUCompanyUsers",
            "FolderDescription": "Test For BU&Company&Users"
        },
        {
            "id": "151",
            "osid": "53",
            "count": "0",
            "matching": "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq|qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
            "FolderTitle": "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
            "FolderDescription": "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
        },
        {
            "id": "153",
            "osid": "55",
            "count": "0",
            "matching": "Test220321|12131",
            "FolderTitle": "Test220321",
            "FolderDescription": "12131"
        },
        {
            "id": "154",
            "osid": "56",
            "count": "0",
            "matching": "Test for ePolicy|TEST for ePolicy function",
            "FolderTitle": "Test for ePolicy",
            "FolderDescription": "TEST for ePolicy function"
        },
        {
            "id": "155",
            "osid": "57",
            "count": "0",
            "matching": "Test240517|123131",
            "FolderTitle": "Test240517",
            "FolderDescription": "123131"
        },
        {
            "id": "156",
            "osid": "58",
            "count": "0",
            "matching": "E-portal Policy|E-portal Policy",
            "FolderTitle": "E-portal Policy",
            "FolderDescription": "E-portal Policy"
        },
        {
            "id": "157",
            "osid": "59",
            "count": "0",
            "matching": "test|test",
            "FolderTitle": "test",
            "FolderDescription": "test"
        },
        {
            "id": "158",
            "osid": "60",
            "count": "0",
            "matching": "test11|Code Of Conduct Admin",
            "FolderTitle": "test11",
            "FolderDescription": "Code Of Conduct Admin"
        },
        {
            "id": "159",
            "osid": "61",
            "count": "0",
            "matching": "1|1",
            "FolderTitle": "1",
            "FolderDescription": "1"
        },
        {
            "id": "160",
            "osid": "62",
            "count": "0",
            "matching": "IT|IT",
            "FolderTitle": "IT",
            "FolderDescription": "IT"
        },
        {
            "id": "161",
            "osid": "63",
            "count": "2",
            "matching": "GHR|GHR",
            "FolderTitle": "GHR",
            "FolderDescription": "GHR"
        }
    ],
    "page": 1,
    "total": 62,
    "errMsg": "success",
    "status": "0",
    "pageSize": 100,
    "totalPages": 1
}

    return mockData
  }
  try {
    const requestBody = {
      ...(body.page ? { page: body.page } : {}),
      ...(body.pageSize ? { pageSize: body.pageSize } : {})
    }
    const notificationApiPrefix = '/api/r/internal'
    const response = await $fetch.raw<Record<string, unknown>>(`${config.public.apiBase}${notificationApiPrefix}/ecology_oa/company_document`, {
      method: 'POST',
      headers: getForwardHeaders(event),
      body: requestBody,
    })

    forwardSetCookieHeaders(event, response)

    return {
      success: true,
      data: response._data,
    }
  } catch (error) {
    console.log(error)
    return []
  }
})
