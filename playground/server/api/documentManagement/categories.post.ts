import { proxyRequest } from '~/server/utils/requestProxy'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
    if (config.mockEnabled) {
        const Acknowledged = {
            "data": [
                {
                    "id": "1",
                    "osid": "1",
                    "count": "3",
                    "matching": "Group DOA|Group DOA",
                    "FolderTitle": "Group DOA",
                    "FolderDescription": "Group DOA"
                },
                {
                    "id": "2",
                    "osid": "2",
                    "count": "6",
                    "matching": "Group Financial Control Policies|Group Financial Control Policies",
                    "FolderTitle": "Group Financial Control Policies",
                    "FolderDescription": "Group Financial Control Policies"
                },
                {
                    "id": "4",
                    "osid": "4",
                    "count": "1",
                    "matching": "Anti-money Laundering Policy|Anti-money Laundering Policy",
                    "FolderTitle": "Anti-money Laundering Policy",
                    "FolderDescription": "Anti-money Laundering Policy"
                },
                {
                    "id": "5",
                    "osid": "5",
                    "count": "1",
                    "matching": "Tai Luen Coffee - DOA|maping group 20180808",
                    "FolderTitle": "Tai Luen Coffee - DOA",
                    "FolderDescription": "maping group 20180808"
                },
                {
                    "id": "8",
                    "osid": "8",
                    "count": "1",
                    "matching": "Auriga & IMSA Group – Finance Policies|Auriga & IMSA Group – Finance Policies",
                    "FolderTitle": "Auriga & IMSA Group – Finance Policies",
                    "FolderDescription": "Auriga & IMSA Group – Finance Policies"
                },
                {
                    "id": "15",
                    "osid": "15",
                    "count": "1",
                    "matching": "HK Food Mart - DOA|Change name = HK Food Mart - DOA 20180807\r\nmaping 20180808",
                    "FolderTitle": "HK Food Mart - DOA",
                    "FolderDescription": "Change name = HK Food Mart - DOA 20180807\r\nmaping 20180808"
                },
                {
                    "id": "19",
                    "osid": "19",
                    "count": "1",
                    "matching": "HK Food Mart - Finance Policies|Change name = HK Food Mart - Finance Policies 20180807\r\nMaping Group 20180808",
                    "FolderTitle": "HK Food Mart - Finance Policies",
                    "FolderDescription": "Change name = HK Food Mart - Finance Policies 20180807\r\nMaping Group 20180808"
                },
                {
                    "id": "28",
                    "osid": "28",
                    "count": "1",
                    "matching": "Group Financial System Policies|Group Financial System Policies",
                    "FolderTitle": "Group Financial System Policies",
                    "FolderDescription": "Group Financial System Policies"
                },
                {
                    "id": "47",
                    "osid": "47",
                    "count": "1",
                    "matching": "Cantonese Session Training|This folder is for Cantonese Session of ePolicy Training",
                    "FolderTitle": "Cantonese Session Training",
                    "FolderDescription": "This folder is for Cantonese Session of ePolicy Training"
                },
                {
                    "id": "51",
                    "osid": "51",
                    "count": "2",
                    "matching": "Group Human Resources Policies|Group Human Resources Policies",
                    "FolderTitle": "Group Human Resources Policies",
                    "FolderDescription": "Group Human Resources Policies"
                },
                {
                    "id": "52",
                    "osid": "52",
                    "count": "2",
                    "matching": "TestForBUCompanyUsers|Test For BU&Company&Users",
                    "FolderTitle": "TestForBUCompanyUsers",
                    "FolderDescription": "Test For BU&Company&Users"
                }
            ],
            "page": 1,
            "total": 11,
            "errMsg": "success",
            "status": "0",
            "pageSize": 20,
            "totalPages": 1
        }
        const NotYetAcknowledged = 
        {
                "data": [
                    {
                        "id": "1",
                        "osid": "1",
                        "count": "3",
                        "matching": "Group DOA|Group DOA",
                        "FolderTitle": "Group DOA",
                        "FolderDescription": "Group DOA"
                    },
                    {
                        "id": "2",
                        "osid": "2",
                        "count": "6",
                        "matching": "Group Financial Control Policies|Group Financial Control Policies",
                        "FolderTitle": "Group Financial Control Policies",
                        "FolderDescription": "Group Financial Control Policies"
                    },
                    {
                        "id": "3",
                        "osid": "3",
                        "count": "24",
                        "matching": "PRC Food - Finance Policies|PRC Food - Finance Policies",
                        "FolderTitle": "PRC Food - Finance Policies",
                        "FolderDescription": "PRC Food - Finance Policies"
                    },
                    {
                        "id": "4",
                        "osid": "4",
                        "count": "1",
                        "matching": "Anti-money Laundering Policy|Anti-money Laundering Policy",
                        "FolderTitle": "Anti-money Laundering Policy",
                        "FolderDescription": "Anti-money Laundering Policy"
                    },
                    {
                        "id": "5",
                        "osid": "5",
                        "count": "1",
                        "matching": "Tai Luen Coffee - DOA|maping group 20180808",
                        "FolderTitle": "Tai Luen Coffee - DOA",
                        "FolderDescription": "maping group 20180808"
                    },
                    {
                        "id": "6",
                        "osid": "6",
                        "count": "11",
                        "matching": "Integrated Market Services (Philippines) - Finance Policies|Integrated Market Services (Philippines) - Finance Policies",
                        "FolderTitle": "Integrated Market Services (Philippines) - Finance Policies",
                        "FolderDescription": "Integrated Market Services (Philippines) - Finance Policies"
                    },
                    {
                        "id": "7",
                        "osid": "7",
                        "count": "33",
                        "matching": "中国食品SOP|中国食品SOP",
                        "FolderTitle": "中国食品SOP",
                        "FolderDescription": "中国食品SOP"
                    },
                    {
                        "id": "8",
                        "osid": "8",
                        "count": "1",
                        "matching": "Auriga & IMSA Group – Finance Policies|Auriga & IMSA Group – Finance Policies",
                        "FolderTitle": "Auriga & IMSA Group – Finance Policies",
                        "FolderDescription": "Auriga & IMSA Group – Finance Policies"
                    },
                    {
                        "id": "9",
                        "osid": "9",
                        "count": "5",
                        "matching": "Group Business Record Keeping Guidelines|Group Business Record Keeping Guidelines",
                        "FolderTitle": "Group Business Record Keeping Guidelines",
                        "FolderDescription": "Group Business Record Keeping Guidelines"
                    },
                    {
                        "id": "10",
                        "osid": "10",
                        "count": "10",
                        "matching": "IMSA - Finance Policies|Change name = IMSA - Finance Policies 20180807\r\nmaping group 20180808",
                        "FolderTitle": "IMSA - Finance Policies",
                        "FolderDescription": "Change name = IMSA - Finance Policies 20180807\r\nmaping group 20180808"
                    },
                    {
                        "id": "11",
                        "osid": "11",
                        "count": "1",
                        "matching": "Special Purpose Vehicle (SPV) Management Rules|Special Purpose Vehicle (SPV) Management Rules",
                        "FolderTitle": "Special Purpose Vehicle (SPV) Management Rules",
                        "FolderDescription": "Special Purpose Vehicle (SPV) Management Rules"
                    },
                    {
                        "id": "12",
                        "osid": "12",
                        "count": "1",
                        "matching": "Tai Luen Coffee - Finance Policies|Change name = Tai Luen Coffee - Finance Policies 20180807\r\nmaping group 20180808",
                        "FolderTitle": "Tai Luen Coffee - Finance Policies",
                        "FolderDescription": "Change name = Tai Luen Coffee - Finance Policies 20180807\r\nmaping group 20180808"
                    },
                    {
                        "id": "13",
                        "osid": "13",
                        "count": "0",
                        "matching": "LF Asia Marketing (Indonesia) - Finance Policies|LF Asia Marketing (Indonesia) - Finance Policies",
                        "FolderTitle": "LF Asia Marketing (Indonesia) - Finance Policies",
                        "FolderDescription": "LF Asia Marketing (Indonesia) - Finance Policies"
                    },
                    {
                        "id": "14",
                        "osid": "14",
                        "count": "6",
                        "matching": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies|DCH Auriga & JDH Marketing (Thailand) - Finance Policies",
                        "FolderTitle": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies",
                        "FolderDescription": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies"
                    },
                    {
                        "id": "15",
                        "osid": "15",
                        "count": "1",
                        "matching": "HK Food Mart - DOA|Change name = HK Food Mart - DOA 20180807\r\nmaping 20180808",
                        "FolderTitle": "HK Food Mart - DOA",
                        "FolderDescription": "Change name = HK Food Mart - DOA 20180807\r\nmaping 20180808"
                    },
                    {
                        "id": "16",
                        "osid": "16",
                        "count": "0",
                        "matching": "DCH Auriga (Borneo) - Finance Policies|DCH Auriga (Borneo) - Finance Policies",
                        "FolderTitle": "DCH Auriga (Borneo) - Finance Policies",
                        "FolderDescription": "DCH Auriga (Borneo) - Finance Policies"
                    },
                    {
                        "id": "17",
                        "osid": "17",
                        "count": "0",
                        "matching": "DCH CP - Finance Policies|Change name =  DCH CP - Finance Policies 20180807\r\nmaping 20180808",
                        "FolderTitle": "DCH CP - Finance Policies",
                        "FolderDescription": "Change name =  DCH CP - Finance Policies 20180807\r\nmaping 20180808"
                    },
                    {
                        "id": "18",
                        "osid": "18",
                        "count": "2",
                        "matching": "FMP - Finance Policies|Change name = FMP - Finance Policies 20180807\r\nMaping 20180808",
                        "FolderTitle": "FMP - Finance Policies",
                        "FolderDescription": "Change name = FMP - Finance Policies 20180807\r\nMaping 20180808"
                    },
                    {
                        "id": "19",
                        "osid": "19",
                        "count": "1",
                        "matching": "HK Food Mart - Finance Policies|Change name = HK Food Mart - Finance Policies 20180807\r\nMaping Group 20180808",
                        "FolderTitle": "HK Food Mart - Finance Policies",
                        "FolderDescription": "Change name = HK Food Mart - Finance Policies 20180807\r\nMaping Group 20180808"
                    },
                    {
                        "id": "20",
                        "osid": "20",
                        "count": "0",
                        "matching": "DCH Contract Manufacturing - Finance Policies|DCH Contract Manufacturing - Finance Policies",
                        "FolderTitle": "DCH Contract Manufacturing - Finance Policies",
                        "FolderDescription": "DCH Contract Manufacturing - Finance Policies"
                    }
                ],
                "page": 1,
                "total": 62,
                "errMsg": "success",
                "status": "0",
                "pageSize": 20,
                "totalPages": 4
            }
        const requestedStatus = String(body.status || '')
        if (requestedStatus == 'Acknowledged') {
            return Acknowledged
        } else if (requestedStatus == 'NotYetAcknowledged') {
            return NotYetAcknowledged
        } else {
            return {
            "data": [
                {
                    "id": "3",
                    "osid": "3",
                    "count": "24",
                    "matching": "PRC Food - Finance Policies|PRC Food - Finance Policies",
                    "FolderTitle": "PRC Food - Finance Policies",
                    "FolderDescription": "PRC Food - Finance Policies"
                },
                {
                    "id": "6",
                    "osid": "6",
                    "count": "11",
                    "matching": "Integrated Market Services (Philippines) - Finance Policies|Integrated Market Services (Philippines) - Finance Policies",
                    "FolderTitle": "Integrated Market Services (Philippines) - Finance Policies",
                    "FolderDescription": "Integrated Market Services (Philippines) - Finance Policies"
                },
                {
                    "id": "7",
                    "osid": "7",
                    "count": "33",
                    "matching": "中国食品SOP|中国食品SOP",
                    "FolderTitle": "中国食品SOP",
                    "FolderDescription": "中国食品SOP"
                },
                {
                    "id": "9",
                    "osid": "9",
                    "count": "5",
                    "matching": "Group Business Record Keeping Guidelines|Group Business Record Keeping Guidelines",
                    "FolderTitle": "Group Business Record Keeping Guidelines",
                    "FolderDescription": "Group Business Record Keeping Guidelines"
                },
                {
                    "id": "10",
                    "osid": "10",
                    "count": "10",
                    "matching": "IMSA - Finance Policies|Change name = IMSA - Finance Policies 20180807\r\nmaping group 20180808",
                    "FolderTitle": "IMSA - Finance Policies",
                    "FolderDescription": "Change name = IMSA - Finance Policies 20180807\r\nmaping group 20180808"
                },
                {
                    "id": "11",
                    "osid": "11",
                    "count": "1",
                    "matching": "Special Purpose Vehicle (SPV) Management Rules|Special Purpose Vehicle (SPV) Management Rules",
                    "FolderTitle": "Special Purpose Vehicle (SPV) Management Rules",
                    "FolderDescription": "Special Purpose Vehicle (SPV) Management Rules"
                },
                {
                    "id": "12",
                    "osid": "12",
                    "count": "1",
                    "matching": "Tai Luen Coffee - Finance Policies|Change name = Tai Luen Coffee - Finance Policies 20180807\r\nmaping group 20180808",
                    "FolderTitle": "Tai Luen Coffee - Finance Policies",
                    "FolderDescription": "Change name = Tai Luen Coffee - Finance Policies 20180807\r\nmaping group 20180808"
                },
                {
                    "id": "13",
                    "osid": "13",
                    "count": "0",
                    "matching": "LF Asia Marketing (Indonesia) - Finance Policies|LF Asia Marketing (Indonesia) - Finance Policies",
                    "FolderTitle": "LF Asia Marketing (Indonesia) - Finance Policies",
                    "FolderDescription": "LF Asia Marketing (Indonesia) - Finance Policies"
                },
                {
                    "id": "14",
                    "osid": "14",
                    "count": "6",
                    "matching": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies|DCH Auriga & JDH Marketing (Thailand) - Finance Policies",
                    "FolderTitle": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies",
                    "FolderDescription": "DCH Auriga & JDH Marketing (Thailand) - Finance Policies"
                },
                {
                    "id": "16",
                    "osid": "16",
                    "count": "0",
                    "matching": "DCH Auriga (Borneo) - Finance Policies|DCH Auriga (Borneo) - Finance Policies",
                    "FolderTitle": "DCH Auriga (Borneo) - Finance Policies",
                    "FolderDescription": "DCH Auriga (Borneo) - Finance Policies"
                },
                {
                    "id": "17",
                    "osid": "17",
                    "count": "0",
                    "matching": "DCH CP - Finance Policies|Change name =  DCH CP - Finance Policies 20180807\r\nmaping 20180808",
                    "FolderTitle": "DCH CP - Finance Policies",
                    "FolderDescription": "Change name =  DCH CP - Finance Policies 20180807\r\nmaping 20180808"
                },
                {
                    "id": "18",
                    "osid": "18",
                    "count": "2",
                    "matching": "FMP - Finance Policies|Change name = FMP - Finance Policies 20180807\r\nMaping 20180808",
                    "FolderTitle": "FMP - Finance Policies",
                    "FolderDescription": "Change name = FMP - Finance Policies 20180807\r\nMaping 20180808"
                },
                {
                    "id": "20",
                    "osid": "20",
                    "count": "0",
                    "matching": "DCH Contract Manufacturing - Finance Policies|DCH Contract Manufacturing - Finance Policies",
                    "FolderTitle": "DCH Contract Manufacturing - Finance Policies",
                    "FolderDescription": "DCH Contract Manufacturing - Finance Policies"
                },
                {
                    "id": "21",
                    "osid": "21",
                    "count": "3",
                    "matching": "Group Taxation Policies|Group Taxation Policies",
                    "FolderTitle": "Group Taxation Policies",
                    "FolderDescription": "Group Taxation Policies"
                },
                {
                    "id": "22",
                    "osid": "22",
                    "count": "1",
                    "matching": "Sims Trading - Finance Policies|Change name = Sims Trading - Finance Policies 20180807\r\nmaping group 20180808",
                    "FolderTitle": "Sims Trading - Finance Policies",
                    "FolderDescription": "Change name = Sims Trading - Finance Policies 20180807\r\nmaping group 20180808"
                },
                {
                    "id": "23",
                    "osid": "23",
                    "count": "7",
                    "matching": "DCH (Japan) Group - Finance Policies|Change name = DCH (Japan) Group - Finance Policies 20180807\r\nMaping group 20180808",
                    "FolderTitle": "DCH (Japan) Group - Finance Policies",
                    "FolderDescription": "Change name = DCH (Japan) Group - Finance Policies 20180807\r\nMaping group 20180808"
                },
                {
                    "id": "24",
                    "osid": "24",
                    "count": "2",
                    "matching": "HK Food Trading - Finance Policies|Change name  = HK Food Trading - Finance Policies 20180807\r\nmaping group 20180808",
                    "FolderTitle": "HK Food Trading - Finance Policies",
                    "FolderDescription": "Change name  = HK Food Trading - Finance Policies 20180807\r\nmaping group 20180808"
                },
                {
                    "id": "25",
                    "osid": "25",
                    "count": "0",
                    "matching": "DCH Auriga & IMSA (Malaysia) - Finance Policies|DCH Auriga & IMSA (Malaysia) - Finance Policies",
                    "FolderTitle": "DCH Auriga & IMSA (Malaysia) - Finance Policies",
                    "FolderDescription": "DCH Auriga & IMSA (Malaysia) - Finance Policies"
                },
                {
                    "id": "26",
                    "osid": "26",
                    "count": "1",
                    "matching": "Group Treasury Policies|Group Treasury Policies",
                    "FolderTitle": "Group Treasury Policies",
                    "FolderDescription": "Group Treasury Policies"
                },
                {
                    "id": "27",
                    "osid": "27",
                    "count": "1",
                    "matching": "Sims Trading - DOA|maping group20180809",
                    "FolderTitle": "Sims Trading - DOA",
                    "FolderDescription": "maping group20180809"
                }
            ],
            "page": 1,
            "total": 51,
            "errMsg": "success",
            "status": "0",
            "pageSize": 20,
            "totalPages": 3
        }
        }
    }
    try {
        const response = await proxyRequest<Record<string, any>>(event, '/api/r/internal/ecology_oa/company_document', {
            method: 'POST',
            body: {
                page: body.page ?? 1,
                pageSize: body.pageSize ?? 20,
                matchingKeyword: body.matchingKeyword ?? '',
                status: body.status ?? '',
            },
            errorMessage: 'Fetch document categories failed',
        })

        return response
    } catch (error) {
        console.log(error)
        return []
    }
})
