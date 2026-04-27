export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    if (config.mockEnabled) {
        return {
            "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><mxGraphModel grid=\"1\" gridSize=\"10\" guides=\"1\" tooltips=\"1\" connect=\"1\" arrows=\"1\" fold=\"1\" page=\"1\" pageScale=\"1\" pageWidth=\"1430\" pageHeight=\"516\" background=\"#ffffff\"><root><mxCell id=\"0\" vertex=\"1\"/><mxCell id=\"1\" vertex=\"1\" parent=\"0\"/><mxCell edge=\"1\" linkId=\"785\" id=\"link_785\" parent=\"1\" value=\"Pending\" source=\"node_655\" target=\"node_657\" isreject=\"0\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.45;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell edge=\"1\" linkId=\"787\" id=\"link_787\" parent=\"1\" value=\"Submitted\" source=\"node_657\" target=\"node_861\" isreject=\"0\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell edge=\"1\" linkId=\"788\" id=\"link_788\" parent=\"1\" value=\"BU Director Approved\" source=\"node_658\" target=\"node_863\" isreject=\"0\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0.5;entryY=1;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell edge=\"1\" linkId=\"789\" id=\"link_789\" parent=\"1\" value=\"Reject\" source=\"node_658\" target=\"node_657\" isreject=\"1\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=1;entryX=0.5;entryY=1;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell edge=\"1\" linkId=\"1023\" id=\"link_1023\" parent=\"1\" value=\"Branch for BU Head\" source=\"node_861\" target=\"node_862\" isreject=\"0\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell edge=\"1\" linkId=\"1024\" id=\"link_1024\" parent=\"1\" value=\"Branch for BU Director\" source=\"node_861\" target=\"node_658\" isreject=\"0\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=1;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell edge=\"1\" linkId=\"1025\" id=\"link_1025\" parent=\"1\" value=\"Reject by BU Head\" source=\"node_862\" target=\"node_657\" isreject=\"1\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=0.5;exitY=0;entryX=0.5;entryY=0;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell edge=\"1\" linkId=\"1026\" id=\"link_1026\" parent=\"1\" value=\"BU Head Approved\" source=\"node_862\" target=\"node_863\" isreject=\"0\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell edge=\"1\" linkId=\"1027\" id=\"link_1027\" parent=\"1\" value=\"Approved\" source=\"node_863\" target=\"node_656\" isreject=\"0\" exitInfo=\"\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;\"><mxGeometry as=\"geometry\" relative=\"1\"/></mxCell><mxCell id=\"node_655\" nodeId=\"655\" value=\"Created by GICRM\" vertex=\"1\" parent=\"1\" nodeType=\"0\" nodeAttriBute=\"0\" style=\"ellipse;whiteSpace=wrap;html=1;resizable=0;icons={&quot;right&quot;:&quot;icon-workflow-ceshi&quot;};fillColor=#BFF3C3;strokeColor=#5ABD6B;\"><mxGeometry x=\"80\" y=\"80\" width=\"93\" height=\"93\" as=\"geometry\"/></mxCell><mxCell id=\"node_656\" nodeId=\"656\" value=\"BU Submitted\" vertex=\"1\" parent=\"1\" nodeType=\"3\" nodeAttriBute=\"0\" style=\"ellipse;whiteSpace=wrap;html=1;icons={&quot;right&quot;:&quot;icon-workflow-guidang&quot;};fillColor=#BFF3C3;strokeColor=#5ABD6B;resizable=0;\"><mxGeometry x=\"1010\" y=\"80\" width=\"93\" height=\"93\" as=\"geometry\"/></mxCell><mxCell id=\"node_657\" nodeId=\"657\" value=\"Upload and submit Report Outline\" vertex=\"1\" parent=\"1\" nodeType=\"2\" nodeAttriBute=\"0\" style=\"rounded=0;whiteSpace=wrap;html=1;fillColor=#BFF3C3;strokeColor=#5ABD6B;resizable=0;\"><mxGeometry x=\"262\" y=\"91\" width=\"108\" height=\"70\" as=\"geometry\"/></mxCell><mxCell id=\"node_658\" nodeId=\"658\" value=\"BU Director Approval\" vertex=\"1\" parent=\"1\" nodeType=\"1\" nodeAttriBute=\"2\" style=\"rhombus;whiteSpace=wrap;html=1;fillColor=#BFF3C3;strokeColor=#5ABD6B;resizable=0;icons={&quot;left&quot;:&quot;icon-workflow-fenchazhongjiandian&quot;};\"><mxGeometry x=\"650\" y=\"287\" width=\"110\" height=\"100\" as=\"geometry\"/></mxCell><mxCell id=\"node_861\" nodeId=\"861\" value=\"Branch for BU Head and BU Director\" vertex=\"1\" parent=\"1\" nodeType=\"6\" nodeAttriBute=\"1\" style=\"shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;rotatable=0;icons={&quot;left&quot;:&quot;icon-workflow-fencha&quot;,&quot;center&quot;:&quot;icon icon-robot icon-robotRelease-preparation&quot;};fillColor=#BFF3C3;strokeColor=#5ABD6B;resizable=0;fontColor=#345e3a;\"><mxGeometry x=\"440\" y=\"86\" width=\"120\" height=\"80\" as=\"geometry\"/></mxCell><mxCell id=\"node_862\" nodeId=\"862\" value=\"BU Head Approval\" vertex=\"1\" parent=\"1\" nodeType=\"1\" nodeAttriBute=\"2\" style=\"rhombus;whiteSpace=wrap;html=1;fillColor=#BFF3C3;strokeColor=#5ABD6B;resizable=0;icons={&quot;left&quot;:&quot;icon-workflow-fenchazhongjiandian&quot;};\"><mxGeometry x=\"650\" y=\"76\" width=\"110\" height=\"100\" as=\"geometry\"/></mxCell><mxCell id=\"node_863\" nodeId=\"863\" value=\"Merge for BU Director and BU Head\" vertex=\"1\" parent=\"1\" nodeType=\"6\" nodeAttriBute=\"4\" targetBranchValue=\"link_788,link_1026\" style=\"shape=hexagon;perimeter=hexagonPerimeter2;rotatable=0;whiteSpace=wrap;html=1;fillColor=#BFF3C3;strokeColor=#5ABD6B;resizable=0;icons={&quot;left&quot;:&quot;icon-workflow-hebing&quot;,&quot;center&quot;:&quot;icon icon-robot icon-robotRelease-preparation&quot;};\"><mxGeometry x=\"830\" y=\"86\" width=\"120\" height=\"80\" as=\"geometry\"/></mxCell></root></mxGraphModel>",
            "logInfo": {
                "isEnd": true,
                "loglist": [],
                "totalCount": 0,
                "maxrequestlogid": ""
            },
            "formInfo": {
                "params": {
                    "user": {
                        "pwd": "4F93FC5FE9036869F66ABEFA72C73848",
                        "sex": "0",
                        "uID": 19831,
                        "city": 0,
                        "type": 0,
                        "admin": false,
                        "agent": 0,
                        "email": "yaojin.shu@dchbi.com",
                        "title": "",
                        "mobile": "",
                        "remark": "",
                        "serial": "",
                        "status": 0,
                        "account": "",
                        "enddate": "",
                        "loginid": "yaojin.shu@dchbi.com",
                        "loginip": "",
                        "needusb": 0,
                        "jobgroup": "",
                        "joblevel": "",
                        "jobtitle": "5415",
                        "language": 7,
                        "lastname": "shu yaojin",
                        "parentid": 0,
                        "postcode": "",
                        "province": 0,
                        "readonly": false,
                        "seclevel": "21",
                        "username": "shu yaojin",
                        "aliasname": "",
                        "countryid": "1",
                        "firstname": "",
                        "logintype": "1",
                        "managerid": "9841",
                        "mergeFlag": true,
                        "startdate": "2023-03-01",
                        "telephone": "",
                        "currencyid": "",
                        "locationid": "",
                        "mobilecall": "",
                        "assistantid": "",
                        "belongtoids": "",
                        "jobactivity": "",
                        "account_type": "0",
                        "contractdate": "",
                        "costcenterid": "",
                        "resourcetype": "",
                        "lastlogindate": "2026-04-22",
                        "purchaselimit": "",
                        "titlelocation": "",
                        "receiveaddress": "",
                        "userDepartment": 33861,
                        "useAttrLanguage": false,
                        "userSubCompany1": 280,
                        "userSubCompany2": 0,
                        "userSubCompany3": 0,
                        "userSubCompany4": 0
                    },
                    "em_url": "http://101.32.178.131:8999",
                    "formid": -330,
                    "isFree": "0",
                    "isbill": "1",
                    "ismode": 2,
                    "margin": "30px 50px 30px 50px",
                    "modeid": 1469,
                    "nodeid": 657,
                    "showAI": 1,
                    "authStr": "dmlld0NoYWluPTUwNjU5NHxtYWluaWQ9NTA2NTk0fA==",
                    "creater": 26085,
                    "isCptwf": false,
                    "isagent": 0,
                    "isprint": "0",
                    "isurger": false,
                    "toexcel": 0,
                    "coworkid": 0,
                    "iscowork": 0,
                    "isremark": "0",
                    "isshared": "",
                    "itemCode": "NODE",
                    "lastname": "shu yaojin",
                    "nodename": "Upload and submit Report Outline",
                    "nodetype": "2",
                    "sendPage": "",
                    "agentType": 0,
                    "beagenter": 0,
                    "docfileid": "",
                    "helpdocid": -1,
                    "isrequest": "",
                    "iswfshare": "0",
                    "mouldCode": "WORKFLOW",
                    "requestid": 506594,
                    "titlename": "流程:处理 - ICSA BU Group Summary Report Submission Flow - Pending <span id='requestmarkSpan'>ICSA2025375</span>",
                    "wfTestStr": "",
                    "wfmonitor": false,
                    "belongTest": false,
                    "custompage": {
                        "jsPage": [],
                        "cssPage": [],
                        "jspPage": []
                    },
                    "docViewUrl": "/spa/document/index.jsp",
                    "isHideArea": "",
                    "isSelfAuth": 1,
                    "isviewonly": 0,
                    "languageid": 7,
                    "layouttype": 0,
                    "newdocpath": "",
                    "workflowid": 111,
                    "creatertype": 0,
                    "em_url_open": "https://dchappsuat.dch.com.hk:8444",
                    "fileViewUrl": "/spa/document/index2file.jsp",
                    "hasFreeNode": false,
                    "isHideInput": "",
                    "isSignInput": "1",
                    "ismodeCptwf": false,
                    "linkageUUID": "3DACD5C14CD04874B8660B000D293C12",
                    "needconfirm": "1",
                    "requestType": 1,
                    "requestname": "ICSA BU Group Summary Report Submission Flow-Developer 1-2025-10-17",
                    "takisremark": 0,
                    "verifyRight": true,
                    "btnLabelName": {
                        "picTab": "流程图",
                        "formTab": "流程表单",
                        "odocTab": "正文",
                        "shareTab": "流程共享",
                        "statusTab": "流程状态",
                        "resourceTab": "相关资源",
                        "communicationTab": "相关交流"
                    },
                    "desrequestid": 0,
                    "existSynergy": false,
                    "isaffirmance": "",
                    "signListType": false,
                    "workflowname": "ICSA BU Group Summary Report Submission Flow",
                    "currentUserid": 19831,
                    "currentnodeid": 657,
                    "isOpenTextTab": false,
                    "isWorkflowDoc": false,
                    "layoutversion": 2,
                    "openNodeCheck": true,
                    "flowDocFieldId": 0,
                    "layoutconfigid": -1,
                    "openDataVerify": "0",
                    "requestnamenew": "ICSA2025375| ICSA BU Group Summary Report Submission Flow-Developer 1-2025-10-17| ICSA | 2025_10_17_3 | BU Summary | Mainland China Motor",
                    "selectNextFlow": "",
                    "billIncludePage": "",
                    "currentnodetype": "2",
                    "intervenorright": 0,
                    "isaffirmanceSrc": "",
                    "issignmustinput": 0,
                    "showDefaultSign": "1",
                    "useInvoiceCloud": false,
                    "agentorByAgentId": -1,
                    "authSignatureStr": "a351b19481638e1fae787a780646e725",
                    "openAutoForecast": "1",
                    "apiResultCacheKey": 1776841828519,
                    "isFreeCustomeForm": 0,
                    "showDefaultLogList": "1",
                    "signatureSecretKey": "4a64c9ffe02b7cba97bcef67e8b5553e",
                    "allowAllPersonGroup": true,
                    "appDetachDisableAll": false,
                    "isOpenCommunication": 0,
                    "showFreeWfSimpleCom": 0,
                    "currentNodeAttribute": "0",
                    "wfFormFieldChangeCfg": [],
                    "canSubmitToRejectNode": true,
                    "selectNextFlowPattern": "-1",
                    "billIncludePage4mobile": "",
                    "isNeedFlowFreeNodeTips": false,
                    "showAutoForecastResult": "1,2",
                    "signatureAttributesStr": "SXNCZUZvcndhcmRNb2RpZnk9MHxmb3JtaWQ9LTMzMHxyZXF1ZXN0bmFtZT1JQ1NBIEJVIEdyb3VwIFN1bW1hcnkgUmVwb3J0IFN1Ym1pc3Npb24gRmxvdy1EZXZlbG9wZXIgMS0yMDI1LTEwLTE3fHRha2VCYWNrPTF8YmVhZ2VudGVyPTB8cmVxdWVzdGxldmVsPTB8Y29hZGlzbW9kaWZ5PTB8SXNCZUZvcndhcmRBbHJlYWR5PXxJc0Nhbk1vZGlmeT1mYWxzZXxjb2Fkc2lnbnR5cGU9MnxjcmVhdGVydHlwZT0wfGxhc3RPcGVyYXRlRGF0ZT0yMDI1LTEwLTE3fElzV2FpdEZvcndhcmRPcGluaW9uPTB8cHJlaXNyZW1hcms9MHxub2RlaWQ9NjU3fHdvcmtmbG93aWQ9MTExfGlzYmlsbD0xfElzQmVGb3J3YXJkUGVuZGluZz0wfGNhbnZpZXc9dHJ1ZXxpc2FnZW50PTB8aGVscGRvY2lkPS0xfGN1cnJlbnRub2RlaWQ9NjU3fGlzUGVuZGluZ1JlbWFyaz10cnVlfElzQmVGb3J3YXJkU3VibWl0QWxyZWFkeT18SXNGcmVlTm9kZT18bGFzdE9wZXJhdGVUaW1lPTE2OjMxOjA2fElzSGFuZGxlRm9yd2FyZD0wfElzQmVGb3J3YXJkU3VibWl0Tm90YXJpZXM9fHJlcXVlc3RpZD01MDY1OTR8Y3JlYXRlcj0yNjA4NXxJc0JlRm9yd2FyZFRvZG89fElzQmVGb3J3YXJkQ2FuU3VibWl0T3Bpbmlvbj10cnVlfHN0YXR1cz1QZW5kaW5nfElzQ2FuU3VibWl0PXRydWV8SXNGcmVlV29ya2Zsb3c9ZmFsc2V8Y3VycmVudG5vZGV0eXBlPTJ8bm9kZXR5cGU9MnxyZXF1ZXN0bWFyaz1JQ1NBMjAyNTM3NXxsYXN0T3BlcmF0b3I9MjYwODV8d29ya2Zsb3duYW1lPUlDU0EgQlUgR3JvdXAgU3VtbWFyeSBSZXBvcnQgU3VibWlzc2lvbiBGbG93fElzU3VibWl0Rm9yd2FyZD0wfGlzcmVtYXJrRm9yUk09MHxJc1BlbmRpbmdGb3J3YXJkPTF8Y29hZGlzZm9yd2FyZD0wfGNvYWRDYW5TdWJtaXQ9ZmFsc2V8aXNPcGVuTW9kaWZ5TG9nPTF8Zm9yd2FyZEJhY2s9MXxJc1N1Ym1pdGVkT3Bpbmlvbj0xfElzQmVGb3J3YXJkU3VibWl0PTB8aXNNb2RpZnlMb2c9fElzQmVGb3J3YXJkPTB8aXNNYWluU3VibWl0dGVkPWZhbHNlfGJpbGxpZD01MzN8SXNBbHJlYWR5Rm9yd2FyZD18d2ZjdXJycmlkPTU1NTc0NXxjdXJyZW50c3RhdHVzPS0xfElzVGFraW5nT3BpbmlvbnM9MHxJc0Zyb21XRlJlbWFya19UPTB8Z3JvdXBkZXRhaWxpZD0xMTk4fElzRnJvbVdGUmVtYXJrPTB8dGFraXNyZW1hcms9MHx3b3JrZmxvd3R5cGU9NDd8Y29hZGlzcGVuZGluZz0wfG5ld2RvY2lkPXxpbnRlcnZlbm9ycmlnaHQ9MHxjYW5Gb3J3ZD1mYWxzZXxkZWxldGVkPTB8Y29hZGlzc3VibWl0ZGVzYz0wfA==",
                    "f_weaver_belongto_userid": "19831",
                    "f_weaver_belongto_usertype": "0"
                },
                "fnaInfo": {
                    "belFna": false,
                    "invoiceCloud": false,
                    "belFnaMultiDimension": false
                },
                "hrmInfo": {
                    "belHrm": false
                },
                "cellInfo": {
                    "style": {
                        "layoutStyle": "<style type=\"text/css\">.mainTd_0_0 span,.mainTd_0_0 div,.mainTd_0_0 input,.mainTd_0_0 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_0{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_1 span,.mainTd_0_1 div,.mainTd_0_1 input,.mainTd_0_1 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_1{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_2 span,.mainTd_0_2 div,.mainTd_0_2 input,.mainTd_0_2 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_2{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_4 span,.mainTd_0_4 div,.mainTd_0_4 input,.mainTd_0_4 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_4{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_5 span,.mainTd_0_5 div,.mainTd_0_5 input,.mainTd_0_5 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_5{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_6 span,.mainTd_0_6 div,.mainTd_0_6 input,.mainTd_0_6 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_6{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_7 span,.mainTd_0_7 div,.mainTd_0_7 input,.mainTd_0_7 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_7{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_8 span,.mainTd_0_8 div,.mainTd_0_8 input,.mainTd_0_8 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_8{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_3 span,.mainTd_0_3 div,.mainTd_0_3 input,.mainTd_0_3 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_3{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_10 span,.mainTd_0_10 div,.mainTd_0_10 input,.mainTd_0_10 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_10{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_11 span,.mainTd_0_11 div,.mainTd_0_11 input,.mainTd_0_11 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_11{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_0_9 span,.mainTd_0_9 div,.mainTd_0_9 input,.mainTd_0_9 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_0_9{\nheight:28px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_1_1 span,.mainTd_1_1 div,.mainTd_1_1 input,.mainTd_1_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_1_1{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_0 span,.mainTd_1_0 div,.mainTd_1_0 input,.mainTd_1_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_1_0{\nheight:31px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_2 span,.mainTd_1_2 div,.mainTd_1_2 input,.mainTd_1_2 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_1_2{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_4 span,.mainTd_1_4 div,.mainTd_1_4 input,.mainTd_1_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_1_4{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_5 span,.mainTd_1_5 div,.mainTd_1_5 input,.mainTd_1_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_1_5{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_6 span,.mainTd_1_6 div,.mainTd_1_6 input,.mainTd_1_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_1_6{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_7 span,.mainTd_1_7 div,.mainTd_1_7 input,.mainTd_1_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_1_7{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_8 span,.mainTd_1_8 div,.mainTd_1_8 input,.mainTd_1_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_1_8{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_3 span,.mainTd_1_3 div,.mainTd_1_3 input,.mainTd_1_3 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_1_3{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_11 span,.mainTd_1_11 div,.mainTd_1_11 input,.mainTd_1_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_1_11{\nheight:31px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_10 span,.mainTd_1_10 div,.mainTd_1_10 input,.mainTd_1_10 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_1_10{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_1_9 span,.mainTd_1_9 div,.mainTd_1_9 input,.mainTd_1_9 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_1_9{\nheight:31px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_2_1 span,.mainTd_2_1 div,.mainTd_2_1 input,.mainTd_2_1 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_2_1{\nheight:42px; background-color:#576980!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_2_0 span,.mainTd_2_0 div,.mainTd_2_0 input,.mainTd_2_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_2_0{\nheight:42px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_2_11 span,.mainTd_2_11 div,.mainTd_2_11 input,.mainTd_2_11 textarea{\ncolor:#ffffff;font-size:16pt;font-family:Microsoft YaHei;\n}\n.mainTd_2_11{\nheight:42px; background-color:#f7f8fa!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_4_1 span,.mainTd_4_1 div,.mainTd_4_1 input,.mainTd_4_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_4_1{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_0 span,.mainTd_4_0 div,.mainTd_4_0 input,.mainTd_4_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_4_0{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_2 span,.mainTd_4_2 div,.mainTd_4_2 input,.mainTd_4_2 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_4_2{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_4 span,.mainTd_4_4 div,.mainTd_4_4 input,.mainTd_4_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_4_4{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_5 span,.mainTd_4_5 div,.mainTd_4_5 input,.mainTd_4_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_4_5{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_6 span,.mainTd_4_6 div,.mainTd_4_6 input,.mainTd_4_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_4_6{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_7 span,.mainTd_4_7 div,.mainTd_4_7 input,.mainTd_4_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_4_7{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_8 span,.mainTd_4_8 div,.mainTd_4_8 input,.mainTd_4_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_4_8{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_3 span,.mainTd_4_3 div,.mainTd_4_3 input,.mainTd_4_3 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_4_3{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_11 span,.mainTd_4_11 div,.mainTd_4_11 input,.mainTd_4_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_4_11{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_10 span,.mainTd_4_10 div,.mainTd_4_10 input,.mainTd_4_10 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_4_10{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_4_9 span,.mainTd_4_9 div,.mainTd_4_9 input,.mainTd_4_9 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_4_9{\nheight:28px; background-color:#576980!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_1 span,.mainTd_5_1 div,.mainTd_5_1 input,.mainTd_5_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_1{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_0 span,.mainTd_5_0 div,.mainTd_5_0 input,.mainTd_5_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_0{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_2 span,.mainTd_5_2 div,.mainTd_5_2 input,.mainTd_5_2 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_5_2{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_4 span,.mainTd_5_4 div,.mainTd_5_4 input,.mainTd_5_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_4{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_5 span,.mainTd_5_5 div,.mainTd_5_5 input,.mainTd_5_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_5{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_6 span,.mainTd_5_6 div,.mainTd_5_6 input,.mainTd_5_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_6{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_7 span,.mainTd_5_7 div,.mainTd_5_7 input,.mainTd_5_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_7{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_8 span,.mainTd_5_8 div,.mainTd_5_8 input,.mainTd_5_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_8{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_3 span,.mainTd_5_3 div,.mainTd_5_3 input,.mainTd_5_3 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_5_3{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_11 span,.mainTd_5_11 div,.mainTd_5_11 input,.mainTd_5_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_11{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_10 span,.mainTd_5_10 div,.mainTd_5_10 input,.mainTd_5_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_5_10{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_5_9 span,.mainTd_5_9 div,.mainTd_5_9 input,.mainTd_5_9 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_5_9{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_6_0 span,.mainTd_6_0 div,.mainTd_6_0 input,.mainTd_6_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_6_0{\nheight:14px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_6_11 span,.mainTd_6_11 div,.mainTd_6_11 input,.mainTd_6_11 textarea{\ncolor:#0271c0;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_6_11{\nheight:14px; background-color:#f7f8fa!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_7_0 span,.mainTd_7_0 div,.mainTd_7_0 input,.mainTd_7_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_0{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_7_1 span,.mainTd_7_1 div,.mainTd_7_1 input,.mainTd_7_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_1{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_7_4 span,.mainTd_7_4 div,.mainTd_7_4 input,.mainTd_7_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_4{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_7_5 span,.mainTd_7_5 div,.mainTd_7_5 input,.mainTd_7_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_5{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_7_6 span,.mainTd_7_6 div,.mainTd_7_6 input,.mainTd_7_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_6{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_7_7 span,.mainTd_7_7 div,.mainTd_7_7 input,.mainTd_7_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_7{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_7_8 span,.mainTd_7_8 div,.mainTd_7_8 input,.mainTd_7_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_8{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_7_10 span,.mainTd_7_10 div,.mainTd_7_10 input,.mainTd_7_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_10{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_7_11 span,.mainTd_7_11 div,.mainTd_7_11 input,.mainTd_7_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_7_11{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_0 span,.mainTd_8_0 div,.mainTd_8_0 input,.mainTd_8_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_0{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_1 span,.mainTd_8_1 div,.mainTd_8_1 input,.mainTd_8_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_1{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_4 span,.mainTd_8_4 div,.mainTd_8_4 input,.mainTd_8_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_4{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_5 span,.mainTd_8_5 div,.mainTd_8_5 input,.mainTd_8_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_5{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_6 span,.mainTd_8_6 div,.mainTd_8_6 input,.mainTd_8_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_6{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_7 span,.mainTd_8_7 div,.mainTd_8_7 input,.mainTd_8_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_7{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_8 span,.mainTd_8_8 div,.mainTd_8_8 input,.mainTd_8_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_8{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_10 span,.mainTd_8_10 div,.mainTd_8_10 input,.mainTd_8_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_10{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_8_11 span,.mainTd_8_11 div,.mainTd_8_11 input,.mainTd_8_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_8_11{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_9_0 span,.mainTd_9_0 div,.mainTd_9_0 input,.mainTd_9_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_9_0{\nheight:32px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_9_1 span,.mainTd_9_1 div,.mainTd_9_1 input,.mainTd_9_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_9_1{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_9_5 span,.mainTd_9_5 div,.mainTd_9_5 input,.mainTd_9_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_9_5{\nheight:32px; background-color:#ffffff!important; border-bottom-width:1px; border-bottom-style:solid; border-bottom-color:#d1d1d1; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; padding-left:4.0px; \n}\n.mainTd_9_6 span,.mainTd_9_6 div,.mainTd_9_6 input,.mainTd_9_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_9_6{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_9_10 span,.mainTd_9_10 div,.mainTd_9_10 input,.mainTd_9_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_9_10{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_9_11 span,.mainTd_9_11 div,.mainTd_9_11 input,.mainTd_9_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_9_11{\nheight:32px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_0 span,.mainTd_10_0 div,.mainTd_10_0 input,.mainTd_10_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_0{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_1 span,.mainTd_10_1 div,.mainTd_10_1 input,.mainTd_10_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_1{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_4 span,.mainTd_10_4 div,.mainTd_10_4 input,.mainTd_10_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_4{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_5 span,.mainTd_10_5 div,.mainTd_10_5 input,.mainTd_10_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_5{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_6 span,.mainTd_10_6 div,.mainTd_10_6 input,.mainTd_10_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_6{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_7 span,.mainTd_10_7 div,.mainTd_10_7 input,.mainTd_10_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_7{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_8 span,.mainTd_10_8 div,.mainTd_10_8 input,.mainTd_10_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_8{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_10 span,.mainTd_10_10 div,.mainTd_10_10 input,.mainTd_10_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_10{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_10_11 span,.mainTd_10_11 div,.mainTd_10_11 input,.mainTd_10_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_10_11{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_0 span,.mainTd_11_0 div,.mainTd_11_0 input,.mainTd_11_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_0{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_1 span,.mainTd_11_1 div,.mainTd_11_1 input,.mainTd_11_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_1{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_4 span,.mainTd_11_4 div,.mainTd_11_4 input,.mainTd_11_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_4{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_5 span,.mainTd_11_5 div,.mainTd_11_5 input,.mainTd_11_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_5{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_6 span,.mainTd_11_6 div,.mainTd_11_6 input,.mainTd_11_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_6{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_7 span,.mainTd_11_7 div,.mainTd_11_7 input,.mainTd_11_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_7{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_8 span,.mainTd_11_8 div,.mainTd_11_8 input,.mainTd_11_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_8{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_10 span,.mainTd_11_10 div,.mainTd_11_10 input,.mainTd_11_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_10{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_11_11 span,.mainTd_11_11 div,.mainTd_11_11 input,.mainTd_11_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_11_11{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_12_0 span,.mainTd_12_0 div,.mainTd_12_0 input,.mainTd_12_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_12_0{\nheight:32px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_12_1 span,.mainTd_12_1 div,.mainTd_12_1 input,.mainTd_12_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_12_1{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_12_5 span,.mainTd_12_5 div,.mainTd_12_5 input,.mainTd_12_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_12_5{\nheight:32px; background-color:#ffffff!important; border-bottom-width:1px; border-bottom-style:solid; border-bottom-color:#d1d1d1; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; padding-left:4.0px; \n}\n.mainTd_12_6 span,.mainTd_12_6 div,.mainTd_12_6 input,.mainTd_12_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_12_6{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_12_10 span,.mainTd_12_10 div,.mainTd_12_10 input,.mainTd_12_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_12_10{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_12_11 span,.mainTd_12_11 div,.mainTd_12_11 input,.mainTd_12_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_12_11{\nheight:32px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_0 span,.mainTd_13_0 div,.mainTd_13_0 input,.mainTd_13_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_0{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_1 span,.mainTd_13_1 div,.mainTd_13_1 input,.mainTd_13_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_1{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_4 span,.mainTd_13_4 div,.mainTd_13_4 input,.mainTd_13_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_4{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_5 span,.mainTd_13_5 div,.mainTd_13_5 input,.mainTd_13_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_5{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_6 span,.mainTd_13_6 div,.mainTd_13_6 input,.mainTd_13_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_6{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_7 span,.mainTd_13_7 div,.mainTd_13_7 input,.mainTd_13_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_7{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_8 span,.mainTd_13_8 div,.mainTd_13_8 input,.mainTd_13_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_8{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_10 span,.mainTd_13_10 div,.mainTd_13_10 input,.mainTd_13_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_10{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_13_11 span,.mainTd_13_11 div,.mainTd_13_11 input,.mainTd_13_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_13_11{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_0 span,.mainTd_14_0 div,.mainTd_14_0 input,.mainTd_14_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_0{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_1 span,.mainTd_14_1 div,.mainTd_14_1 input,.mainTd_14_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_1{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_4 span,.mainTd_14_4 div,.mainTd_14_4 input,.mainTd_14_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_4{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_5 span,.mainTd_14_5 div,.mainTd_14_5 input,.mainTd_14_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_5{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_6 span,.mainTd_14_6 div,.mainTd_14_6 input,.mainTd_14_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_6{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_7 span,.mainTd_14_7 div,.mainTd_14_7 input,.mainTd_14_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_7{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_8 span,.mainTd_14_8 div,.mainTd_14_8 input,.mainTd_14_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_8{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_10 span,.mainTd_14_10 div,.mainTd_14_10 input,.mainTd_14_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_10{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_14_11 span,.mainTd_14_11 div,.mainTd_14_11 input,.mainTd_14_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_14_11{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_15_0 span,.mainTd_15_0 div,.mainTd_15_0 input,.mainTd_15_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_15_0{\nheight:32px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_15_1 span,.mainTd_15_1 div,.mainTd_15_1 input,.mainTd_15_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_15_1{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_15_5 span,.mainTd_15_5 div,.mainTd_15_5 input,.mainTd_15_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_15_5{\nheight:32px; background-color:#ffffff!important; border-bottom-width:1px; border-bottom-style:solid; border-bottom-color:#d1d1d1; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; padding-left:4.0px; \n}\n.mainTd_15_6 span,.mainTd_15_6 div,.mainTd_15_6 input,.mainTd_15_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_15_6{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_15_10 span,.mainTd_15_10 div,.mainTd_15_10 input,.mainTd_15_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_15_10{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_15_11 span,.mainTd_15_11 div,.mainTd_15_11 input,.mainTd_15_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_15_11{\nheight:32px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_12_7 span,.mainTd_12_7 div,.mainTd_12_7 input,.mainTd_12_7 textarea{\ncolor:#8b8b8b;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_12_7{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_12_8 span,.mainTd_12_8 div,.mainTd_12_8 input,.mainTd_12_8 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_12_8{\nheight:32px; background-color:#ffffff!important; border-bottom-width:1px; border-bottom-style:solid; border-bottom-color:#d1d1d1; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_15_7 span,.mainTd_15_7 div,.mainTd_15_7 input,.mainTd_15_7 textarea{\ncolor:#8b8b8b;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_15_7{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_15_8 span,.mainTd_15_8 div,.mainTd_15_8 input,.mainTd_15_8 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_15_8{\nheight:32px; background-color:#ffffff!important; border-bottom-width:1px; border-bottom-style:solid; border-bottom-color:#d1d1d1; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; padding-left:4.0px; \n}\n.mainTd_9_2 span,.mainTd_9_2 div,.mainTd_9_2 input,.mainTd_9_2 textarea{\ncolor:#8b8b8b;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_9_2{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_12_2 span,.mainTd_12_2 div,.mainTd_12_2 input,.mainTd_12_2 textarea{\ncolor:#8b8b8b;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_12_2{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_15_2 span,.mainTd_15_2 div,.mainTd_15_2 input,.mainTd_15_2 textarea{\ncolor:#8b8b8b;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_15_2{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_9_7 span,.mainTd_9_7 div,.mainTd_9_7 input,.mainTd_9_7 textarea{\ncolor:#8b8b8b;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_9_7{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_9_8 span,.mainTd_9_8 div,.mainTd_9_8 input,.mainTd_9_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_9_8{\nheight:32px; background-color:#ffffff!important; border-bottom-width:1px; border-bottom-style:solid; border-bottom-color:#d1d1d1; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_18_11 span,.mainTd_18_11 div,.mainTd_18_11 input,.mainTd_18_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_11{\nheight:32px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_18_0 span,.mainTd_18_0 div,.mainTd_18_0 input,.mainTd_18_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_0{\nheight:32px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_0 span,.mainTd_16_0 div,.mainTd_16_0 input,.mainTd_16_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_0{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_1 span,.mainTd_16_1 div,.mainTd_16_1 input,.mainTd_16_1 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_1{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_2 span,.mainTd_16_2 div,.mainTd_16_2 input,.mainTd_16_2 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_2{\nheight:9px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_3 span,.mainTd_16_3 div,.mainTd_16_3 input,.mainTd_16_3 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_3{\nheight:9px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_4 span,.mainTd_16_4 div,.mainTd_16_4 input,.mainTd_16_4 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_4{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_5 span,.mainTd_16_5 div,.mainTd_16_5 input,.mainTd_16_5 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_5{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_6 span,.mainTd_16_6 div,.mainTd_16_6 input,.mainTd_16_6 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_6{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_7 span,.mainTd_16_7 div,.mainTd_16_7 input,.mainTd_16_7 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_7{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_8 span,.mainTd_16_8 div,.mainTd_16_8 input,.mainTd_16_8 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_8{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_9 span,.mainTd_16_9 div,.mainTd_16_9 input,.mainTd_16_9 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_9{\nheight:9px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_10 span,.mainTd_16_10 div,.mainTd_16_10 input,.mainTd_16_10 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_10{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_16_11 span,.mainTd_16_11 div,.mainTd_16_11 input,.mainTd_16_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_16_11{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_0 span,.mainTd_17_0 div,.mainTd_17_0 input,.mainTd_17_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_0{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_1 span,.mainTd_17_1 div,.mainTd_17_1 input,.mainTd_17_1 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_1{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_2 span,.mainTd_17_2 div,.mainTd_17_2 input,.mainTd_17_2 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_2{\nheight:9px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_3 span,.mainTd_17_3 div,.mainTd_17_3 input,.mainTd_17_3 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_3{\nheight:9px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_4 span,.mainTd_17_4 div,.mainTd_17_4 input,.mainTd_17_4 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_4{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_5 span,.mainTd_17_5 div,.mainTd_17_5 input,.mainTd_17_5 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_5{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_6 span,.mainTd_17_6 div,.mainTd_17_6 input,.mainTd_17_6 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_6{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_7 span,.mainTd_17_7 div,.mainTd_17_7 input,.mainTd_17_7 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_7{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_8 span,.mainTd_17_8 div,.mainTd_17_8 input,.mainTd_17_8 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_8{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_9 span,.mainTd_17_9 div,.mainTd_17_9 input,.mainTd_17_9 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_9{\nheight:9px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_10 span,.mainTd_17_10 div,.mainTd_17_10 input,.mainTd_17_10 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_10{\nheight:9px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_17_11 span,.mainTd_17_11 div,.mainTd_17_11 input,.mainTd_17_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_17_11{\nheight:9px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_18_1 span,.mainTd_18_1 div,.mainTd_18_1 input,.mainTd_18_1 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_1{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_18_2 span,.mainTd_18_2 div,.mainTd_18_2 input,.mainTd_18_2 textarea{\ncolor:#8b8b8b;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_2{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_18_3 span,.mainTd_18_3 div,.mainTd_18_3 input,.mainTd_18_3 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_3{\nheight:32px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_18_4 span,.mainTd_18_4 div,.mainTd_18_4 input,.mainTd_18_4 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_4{\nheight:32px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_18_5 span,.mainTd_18_5 div,.mainTd_18_5 input,.mainTd_18_5 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_5{\nheight:32px; background-color:#ffffff!important; border-bottom-width:1px; border-bottom-style:solid; border-bottom-color:#d1d1d1; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_18_6 span,.mainTd_18_6 div,.mainTd_18_6 input,.mainTd_18_6 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_6{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_18_7 span,.mainTd_18_7 div,.mainTd_18_7 input,.mainTd_18_7 textarea{\ncolor:#8b8b8b;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_7{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_18_8 span,.mainTd_18_8 div,.mainTd_18_8 input,.mainTd_18_8 textarea{\ncolor:black;font-size:9pt;font-family:Microsoft YaHei;\n}\n.mainTd_18_8{\nheight:32px; background-color:#ffffff!important; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_18_9 span,.mainTd_18_9 div,.mainTd_18_9 input,.mainTd_18_9 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_9{\nheight:32px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_18_10 span,.mainTd_18_10 div,.mainTd_18_10 input,.mainTd_18_10 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_18_10{\nheight:32px; background-color:#ffffff!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_22_2 span,.mainTd_22_2 div,.mainTd_22_2 input,.mainTd_22_2 textarea{\nfont-size:9pt;font-family:Microsoft YaHei;font-weight:bold; color:black;\n}\n.mainTd_22_2{\nheight:28px; vertical-align:middle; word-wrap:break-word; word-break:break-word;text-align:left; \n}\n.mainTd_22_11 span,.mainTd_22_11 div,.mainTd_22_11 input,.mainTd_22_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_22_11{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_22_0 span,.mainTd_22_0 div,.mainTd_22_0 input,.mainTd_22_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_22_0{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_0 span,.mainTd_21_0 div,.mainTd_21_0 input,.mainTd_21_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_21_0{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_11 span,.mainTd_21_11 div,.mainTd_21_11 input,.mainTd_21_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_21_11{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_2 span,.mainTd_21_2 div,.mainTd_21_2 input,.mainTd_21_2 textarea{\nfont-size:11pt;font-family:Microsoft YaHei;color:black;\n}\n.mainTd_21_2{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_3 span,.mainTd_21_3 div,.mainTd_21_3 input,.mainTd_21_3 textarea{\nfont-size:11pt;font-family:Microsoft YaHei;color:black;\n}\n.mainTd_21_3{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_4 span,.mainTd_21_4 div,.mainTd_21_4 input,.mainTd_21_4 textarea{\nfont-size:11pt;font-family:Microsoft YaHei;color:black;\n}\n.mainTd_21_4{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_5 span,.mainTd_21_5 div,.mainTd_21_5 input,.mainTd_21_5 textarea{\nfont-size:11pt;font-family:Microsoft YaHei;color:black;\n}\n.mainTd_21_5{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_6 span,.mainTd_21_6 div,.mainTd_21_6 input,.mainTd_21_6 textarea{\nfont-size:11pt;font-family:Microsoft YaHei;color:black;\n}\n.mainTd_21_6{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_7 span,.mainTd_21_7 div,.mainTd_21_7 input,.mainTd_21_7 textarea{\nfont-size:11pt;font-family:Microsoft YaHei;color:black;\n}\n.mainTd_21_7{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_8 span,.mainTd_21_8 div,.mainTd_21_8 input,.mainTd_21_8 textarea{\nfont-size:11pt;font-family:Microsoft YaHei;color:black;\n}\n.mainTd_21_8{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_21_9 span,.mainTd_21_9 div,.mainTd_21_9 input,.mainTd_21_9 textarea{\nfont-size:11pt;font-family:Microsoft YaHei;color:black;\n}\n.mainTd_21_9{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_24_11 span,.mainTd_24_11 div,.mainTd_24_11 input,.mainTd_24_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_24_11{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_25_11 span,.mainTd_25_11 div,.mainTd_25_11 input,.mainTd_25_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_25_11{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_24_0 span,.mainTd_24_0 div,.mainTd_24_0 input,.mainTd_24_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_24_0{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_25_0 span,.mainTd_25_0 div,.mainTd_25_0 input,.mainTd_25_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_25_0{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_26_0 span,.mainTd_26_0 div,.mainTd_26_0 input,.mainTd_26_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_26_0{\nheight:16px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_26_10 span,.mainTd_26_10 div,.mainTd_26_10 input,.mainTd_26_10 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_26_10{\nheight:16px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_26_11 span,.mainTd_26_11 div,.mainTd_26_11 input,.mainTd_26_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_26_11{\nheight:16px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_1 span,.mainTd_27_1 div,.mainTd_27_1 input,.mainTd_27_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_27_1{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_0 span,.mainTd_27_0 div,.mainTd_27_0 input,.mainTd_27_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_27_0{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_2 span,.mainTd_27_2 div,.mainTd_27_2 input,.mainTd_27_2 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_27_2{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_4 span,.mainTd_27_4 div,.mainTd_27_4 input,.mainTd_27_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_27_4{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_5 span,.mainTd_27_5 div,.mainTd_27_5 input,.mainTd_27_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_27_5{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_6 span,.mainTd_27_6 div,.mainTd_27_6 input,.mainTd_27_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_27_6{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_7 span,.mainTd_27_7 div,.mainTd_27_7 input,.mainTd_27_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_27_7{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_8 span,.mainTd_27_8 div,.mainTd_27_8 input,.mainTd_27_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_27_8{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_3 span,.mainTd_27_3 div,.mainTd_27_3 input,.mainTd_27_3 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_27_3{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_11 span,.mainTd_27_11 div,.mainTd_27_11 input,.mainTd_27_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_27_11{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_10 span,.mainTd_27_10 div,.mainTd_27_10 input,.mainTd_27_10 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_27_10{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_27_9 span,.mainTd_27_9 div,.mainTd_27_9 input,.mainTd_27_9 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_27_9{\nheight:18px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_1 span,.mainTd_28_1 div,.mainTd_28_1 input,.mainTd_28_1 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_28_1{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_0 span,.mainTd_28_0 div,.mainTd_28_0 input,.mainTd_28_0 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_28_0{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_2 span,.mainTd_28_2 div,.mainTd_28_2 input,.mainTd_28_2 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_28_2{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_4 span,.mainTd_28_4 div,.mainTd_28_4 input,.mainTd_28_4 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_28_4{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_5 span,.mainTd_28_5 div,.mainTd_28_5 input,.mainTd_28_5 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_28_5{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_6 span,.mainTd_28_6 div,.mainTd_28_6 input,.mainTd_28_6 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_28_6{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_7 span,.mainTd_28_7 div,.mainTd_28_7 input,.mainTd_28_7 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_28_7{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_8 span,.mainTd_28_8 div,.mainTd_28_8 input,.mainTd_28_8 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_28_8{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_3 span,.mainTd_28_3 div,.mainTd_28_3 input,.mainTd_28_3 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_28_3{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_11 span,.mainTd_28_11 div,.mainTd_28_11 input,.mainTd_28_11 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_28_11{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_10 span,.mainTd_28_10 div,.mainTd_28_10 input,.mainTd_28_10 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_28_10{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_28_9 span,.mainTd_28_9 div,.mainTd_28_9 input,.mainTd_28_9 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_28_9{\nheight:10px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_24_2{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_25_2 span,.mainTd_25_2 div,.mainTd_25_2 input,.mainTd_25_2 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_25_2{\nheight:28px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_23_11 span,.mainTd_23_11 div,.mainTd_23_11 input,.mainTd_23_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_23_11{\nheight:12px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_23_0 span,.mainTd_23_0 div,.mainTd_23_0 input,.mainTd_23_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_23_0{\nheight:12px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_26_2 span,.mainTd_26_2 div,.mainTd_26_2 input,.mainTd_26_2 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_26_2{\nheight:16px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_19_0 span,.mainTd_19_0 div,.mainTd_19_0 input,.mainTd_19_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_19_0{\nheight:20px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_20_0 span,.mainTd_20_0 div,.mainTd_20_0 input,.mainTd_20_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_20_0{\nheight:13px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_19_11 span,.mainTd_19_11 div,.mainTd_19_11 input,.mainTd_19_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_19_11{\nheight:20px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_20_11 span,.mainTd_20_11 div,.mainTd_20_11 input,.mainTd_20_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_20_11{\nheight:13px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_26_4 span,.mainTd_26_4 div,.mainTd_26_4 input,.mainTd_26_4 textarea{\nfont-size:9pt; font-family:Microsoft YaHei;color:black;\n}\n.mainTd_26_4{\nheight:16px; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_3_0 span,.mainTd_3_0 div,.mainTd_3_0 input,.mainTd_3_0 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_3_0{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_3_1 span,.mainTd_3_1 div,.mainTd_3_1 input,.mainTd_3_1 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_1{\nheight:28px; background-color:#576980!important; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_11 span,.mainTd_3_11 div,.mainTd_3_11 input,.mainTd_3_11 textarea{\ncolor:black;font-size:9pt; font-family:Microsoft YaHei;\n}\n.mainTd_3_11{\nheight:28px; background-color:#f7f8fa!important; word-wrap:break-word; word-break:break-word;text-align:left; vertical-align:top; \n}\n.mainTd_3_2 span,.mainTd_3_2 div,.mainTd_3_2 input,.mainTd_3_2 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_2{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_3 span,.mainTd_3_3 div,.mainTd_3_3 input,.mainTd_3_3 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_3{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_4 span,.mainTd_3_4 div,.mainTd_3_4 input,.mainTd_3_4 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_4{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_5 span,.mainTd_3_5 div,.mainTd_3_5 input,.mainTd_3_5 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_5{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_6 span,.mainTd_3_6 div,.mainTd_3_6 input,.mainTd_3_6 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_6{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_7 span,.mainTd_3_7 div,.mainTd_3_7 input,.mainTd_3_7 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_7{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_8 span,.mainTd_3_8 div,.mainTd_3_8 input,.mainTd_3_8 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_8{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_9 span,.mainTd_3_9 div,.mainTd_3_9 input,.mainTd_3_9 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_9{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n.mainTd_3_10 span,.mainTd_3_10 div,.mainTd_3_10 input,.mainTd_3_10 textarea{\ncolor:#ffffff;font-size:11pt;font-family:Microsoft YaHei;\n}\n.mainTd_3_10{\nheight:28px; vertical-align:middle; text-align:center; word-wrap:break-word; word-break:break-word;\n}\n</style>",
                        "scriptStyle": "<link href=\"/workflow/exceldesign/css/filterBorder.css\" rel=\"stylesheet\" /><link rel=\"stylesheet\" type=\"text/css\" href=\"/workflow/exceldesign/initcss/modern_simplicity.css\" />"
                    },
                    "isFixed": "1",
                    "labelInfo": {},
                    "nodeNameInfo": {},
                    "subPanelInfo": {},
                    "sysFieldInfo": {
                        "workflowdesc": "",
                        "workflowname": "ICSA BU Group Summary Report Submission Flow",
                        "workflowtype": 47,
                        "workflowtypename": "GICRM - Internal Control Self-Assessment"
                    },
                    "existTextArea": false,
                    "fieldCellInfo": {
                        "14453": {
                            "colid": 5,
                            "rowid": 9,
                            "symbol": "main",
                            "orderid": 306,
                            "rowMark": "main_row_9",
                            "rowspan": 1
                        },
                        "14454": {
                            "colid": 5,
                            "rowid": 12,
                            "symbol": "main",
                            "orderid": 396,
                            "rowMark": "main_row_12",
                            "rowspan": 1
                        },
                        "14455": {
                            "colid": 8,
                            "rowid": 15,
                            "symbol": "main",
                            "orderid": 489,
                            "rowMark": "main_row_15",
                            "rowspan": 1
                        },
                        "14456": {
                            "colid": 5,
                            "rowid": 15,
                            "symbol": "main",
                            "orderid": 486,
                            "rowMark": "main_row_15",
                            "rowspan": 1
                        },
                        "14559": {
                            "colid": 8,
                            "rowid": 12,
                            "symbol": "main",
                            "orderid": 399,
                            "rowMark": "main_row_12",
                            "rowspan": 1
                        },
                        "14576": {
                            "colid": 8,
                            "rowid": 9,
                            "symbol": "main",
                            "orderid": 309,
                            "rowMark": "main_row_9",
                            "rowspan": 1
                        },
                        "14582": {
                            "colid": 5,
                            "rowid": 18,
                            "symbol": "main",
                            "orderid": 576,
                            "rowMark": "main_row_18",
                            "rowspan": 1
                        },
                        "14967": {
                            "colid": 1,
                            "rowid": 3,
                            "symbol": "main",
                            "orderid": 122,
                            "rowMark": "main_row_3",
                            "rowspan": 1
                        }
                    },
                    "mainRowFields": {
                        "main_row_3": [
                            "14967"
                        ],
                        "main_row_9": [
                            "14453",
                            "14576"
                        ],
                        "main_row_12": [
                            "14454",
                            "14559"
                        ],
                        "main_row_15": [
                            "14456",
                            "14455"
                        ],
                        "main_row_18": [
                            "14582"
                        ]
                    },
                    "nodeMarkGroup": [],
                    "nodeMarkContent": {},
                    "printBreakRowInfo": [],
                    "existCurrentWfNodeMark": false
                },
                "codeInfo": {
                    "isUse": true,
                    "fieldCode": "14904",
                    "codefields": [],
                    "hasHistoryCode": false
                },
                "datajson": {
                    "eformdesign": {
                        "eattr": {
                            "wfid": "111",
                            "formid": "-330",
                            "isbill": "1",
                            "nodeid": "657"
                        },
                        "etables": {
                            "emaintable": {
                                "ec": [
                                    {
                                        "id": "0,0",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,1",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,2",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,4",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,5",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,6",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,7",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,8",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,3",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,10",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,11",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "0,9",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "1,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "1,2",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,3",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "1,10",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "1,9",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "2,1",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "uuid": "main-1-1",
                                        "etype": "29",
                                        "field": "1",
                                        "evalue": "ICSA BU Group Summary Report Submission Flow",
                                        "colspan": "10",
                                        "rowspan": "1",
                                        "etxtindent": "2.5",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "2,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "2,11",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "16pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "4,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "4,2",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,3",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "4,10",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "4,9",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "5,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,2",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,3",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "5,9",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "6,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "6,11",
                                        "font": {
                                            "color": "#0271c0",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "7,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "7,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "8",
                                        "rowspan": "2",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "7,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "7,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "7,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "7,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "7,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "7,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "7,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "8,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "8,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "8,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "8,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "8,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "8,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "8,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "8,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "8,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "9,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "9,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "9,5",
                                        "font": {
                                            "valign": "middle"
                                        },
                                        "uuid": "main-r-c",
                                        "etype": "3",
                                        "field": "14453",
                                        "evalue": "Assessment",
                                        "colspan": "1",
                                        "eborder": [
                                            {
                                                "kind": "bottom",
                                                "color": "#d1d1d1",
                                                "style": "1"
                                            }
                                        ],
                                        "rowspan": "1",
                                        "fieldtype": "browser",
                                        "etxtindent": "0.5",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "9,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "9,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "9,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "10,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "10,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "8",
                                        "rowspan": "2",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "10,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "10,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "10,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "10,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "10,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "10,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "10,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "11,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "11,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "11,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "11,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "11,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "11,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "11,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "11,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "11,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "12,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "12,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "12,5",
                                        "font": {
                                            "valign": "middle"
                                        },
                                        "uuid": "main-r-c",
                                        "etype": "3",
                                        "field": "14454",
                                        "evalue": "BU Champion",
                                        "colspan": "1",
                                        "eborder": [
                                            {
                                                "kind": "bottom",
                                                "color": "#d1d1d1",
                                                "style": "1"
                                            }
                                        ],
                                        "rowspan": "1",
                                        "fieldtype": "browser",
                                        "etxtindent": "0.5",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "12,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "12,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "12,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "13,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "13,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "8",
                                        "rowspan": "2",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "13,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "13,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "13,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "13,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "13,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "13,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "13,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "14,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "14,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "14,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "14,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "14,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "14,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "14,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "14,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "14,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "15,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "15,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "15,5",
                                        "font": {
                                            "valign": "middle"
                                        },
                                        "uuid": "main-r-c",
                                        "etype": "3",
                                        "field": "14456",
                                        "evalue": "BU Finance Head",
                                        "colspan": "1",
                                        "eborder": [
                                            {
                                                "kind": "bottom",
                                                "color": "#d1d1d1",
                                                "style": "1"
                                            }
                                        ],
                                        "rowspan": "1",
                                        "fieldtype": "browser",
                                        "etxtindent": "0.5",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "15,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "15,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "15,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "12,7",
                                        "font": {
                                            "color": "#8b8b8b",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-16-71740389141000",
                                        "etype": "2",
                                        "field": "14559",
                                        "evalue": "Entity Submission Status",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "12,8",
                                        "font": {
                                            "color": "black",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-16-81740389143000",
                                        "etype": "3",
                                        "field": "14559",
                                        "evalue": "Entity Submission Status",
                                        "colspan": "1",
                                        "eborder": [
                                            {
                                                "kind": "bottom",
                                                "color": "#d1d1d1",
                                                "style": "1"
                                            }
                                        ],
                                        "rowspan": "1",
                                        "fieldtype": "select",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "15,7",
                                        "font": {
                                            "color": "#8b8b8b",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-r-c",
                                        "etype": "2",
                                        "field": "14455",
                                        "evalue": "BU Director",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "15,8",
                                        "font": {
                                            "color": "black",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-r-c",
                                        "etype": "3",
                                        "field": "14455",
                                        "evalue": "BU Director",
                                        "colspan": "1",
                                        "eborder": [
                                            {
                                                "kind": "bottom",
                                                "color": "#d1d1d1",
                                                "style": "1"
                                            }
                                        ],
                                        "rowspan": "1",
                                        "fieldtype": "browser",
                                        "etxtindent": "0.5",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "9,2",
                                        "font": {
                                            "color": "#8b8b8b",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-r-c",
                                        "etype": "2",
                                        "field": "14453",
                                        "evalue": "Assessment",
                                        "colspan": "3",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "12,2",
                                        "font": {
                                            "color": "#8b8b8b",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-r-c",
                                        "etype": "2",
                                        "field": "14454",
                                        "evalue": "BU Champion",
                                        "colspan": "3",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "15,2",
                                        "font": {
                                            "color": "#8b8b8b",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-r-c",
                                        "etype": "2",
                                        "field": "14456",
                                        "evalue": "BU Finance Head",
                                        "colspan": "3",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "9,7",
                                        "font": {
                                            "color": "#8b8b8b",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-9-71740464333000",
                                        "etype": "2",
                                        "field": "14576",
                                        "evalue": "BU Group",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "9,8",
                                        "font": {
                                            "valign": "middle"
                                        },
                                        "uuid": "main-9-81740464338000",
                                        "etype": "3",
                                        "field": "14576",
                                        "evalue": "BU Group",
                                        "colspan": "1",
                                        "eborder": [
                                            {
                                                "kind": "bottom",
                                                "color": "#d1d1d1",
                                                "style": "1"
                                            }
                                        ],
                                        "rowspan": "1",
                                        "fieldtype": "select",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "18,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "18,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "16,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "16,1",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "8",
                                        "rowspan": "2",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "16,2",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "16,3",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "16,4",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "16,5",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "16,6",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "16,7",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "16,8",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "16,9",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "16,10",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "16,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "17,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "17,1",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "17,2",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "17,3",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "17,4",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "17,5",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "17,6",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "17,7",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "17,8",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "17,9",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "17,10",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "17,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "18,1",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "18,2",
                                        "font": {
                                            "color": "#8b8b8b",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-18-21740464421000",
                                        "etype": "2",
                                        "field": "14582",
                                        "evalue": "Summary Report",
                                        "colspan": "3",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "18,3",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "18,4",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "18,5",
                                        "font": {
                                            "color": "black",
                                            "valign": "middle"
                                        },
                                        "uuid": "main-18-51740464423000",
                                        "etype": "3",
                                        "field": "14582",
                                        "evalue": "Summary Report",
                                        "colspan": "1",
                                        "eborder": [
                                            {
                                                "kind": "bottom",
                                                "color": "#d1d1d1",
                                                "style": "1"
                                            }
                                        ],
                                        "rowspan": "1",
                                        "fieldtype": "affix",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "18,6",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "18,7",
                                        "font": {
                                            "color": "#8b8b8b",
                                            "valign": "middle"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "18,8",
                                        "font": {
                                            "color": "black",
                                            "valign": "middle",
                                            "font-size": "9pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "18,9",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "18,10",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#ffffff"
                                    },
                                    {
                                        "id": "22,2",
                                        "font": {
                                            "bold": "true",
                                            "valign": "middle",
                                            "font-size": "9pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "Please make sure the below entities submitted their assessment and approved. ",
                                        "colspan": "8",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "22,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "22,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "21,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "21,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "21,2",
                                        "font": {
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "Assigned Entities",
                                        "colspan": "8",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "21,3",
                                        "font": {
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "21,4",
                                        "font": {
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "21,5",
                                        "font": {
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "21,6",
                                        "font": {
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "21,7",
                                        "font": {
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "21,8",
                                        "font": {
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "21,9",
                                        "font": {
                                            "font-size": "11pt",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "24,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "25,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "24,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "25,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "26,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "26,10",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "26,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,2",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,3",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,10",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "27,9",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,1",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,0",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,2",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,4",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,5",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,6",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,7",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,8",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,3",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,11",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,10",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "28,9",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "24,2",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "16",
                                        "evalue": "Iframe区域",
                                        "colspan": "8",
                                        "rowspan": "1",
                                        "jsonparam": {
                                            "set_id": "",
                                            "set_src": "/spa/cube/index.html#/main/cube/search?customid=309&mainrequestid=$[assessment]$&bu=$[bu]$",
                                            "set_name": "",
                                            "set_style": "",
                                            "set_height": ""
                                        }
                                    },
                                    {
                                        "id": "25,2",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "8",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "23,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "23,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "26,2",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "19,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "20,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "19,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "20,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "26,4",
                                        "font": {},
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,0",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "3,1",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "uuid": "main-3-11741595170000",
                                        "etype": "3",
                                        "field": "14967",
                                        "evalue": "Assessment",
                                        "colspan": "10",
                                        "rowspan": "1",
                                        "fieldtype": "text",
                                        "etxtindent": "2.5",
                                        "backgroundColor": "#576980"
                                    },
                                    {
                                        "id": "3,11",
                                        "font": {
                                            "color": "black"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1",
                                        "backgroundColor": "#f7f8fa"
                                    },
                                    {
                                        "id": "3,2",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,3",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,4",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,5",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,6",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,7",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,8",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,9",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    },
                                    {
                                        "id": "3,10",
                                        "font": {
                                            "color": "#ffffff",
                                            "valign": "middle",
                                            "font-size": "11pt",
                                            "text-align": "center",
                                            "font-family": "Microsoft YaHei"
                                        },
                                        "etype": "1",
                                        "evalue": "",
                                        "colspan": "1",
                                        "rowspan": "1"
                                    }
                                ],
                                "colheads": {
                                    "col_0": "1%",
                                    "col_1": "2%",
                                    "col_2": "40",
                                    "col_3": "1%",
                                    "col_4": "8%",
                                    "col_5": "30%",
                                    "col_6": "10%",
                                    "col_7": "8%",
                                    "col_8": "30%",
                                    "col_9": "3%",
                                    "col_10": "2%",
                                    "col_11": "1%"
                                },
                                "rowheads": {
                                    "row_0": "28",
                                    "row_1": "31",
                                    "row_2": "42",
                                    "row_3": "28",
                                    "row_4": "28",
                                    "row_5": "18",
                                    "row_6": "14",
                                    "row_7": "9",
                                    "row_8": "9",
                                    "row_9": "32",
                                    "row_10": "9",
                                    "row_11": "9",
                                    "row_12": "32",
                                    "row_13": "9",
                                    "row_14": "9",
                                    "row_15": "32",
                                    "row_16": "9",
                                    "row_17": "9",
                                    "row_18": "32",
                                    "row_19": "20",
                                    "row_20": "13",
                                    "row_21": "28",
                                    "row_22": "28",
                                    "row_23": "12",
                                    "row_24": "28",
                                    "row_25": "28",
                                    "row_26": "16",
                                    "row_27": "18",
                                    "row_28": "10"
                                }
                            }
                        }
                    }
                },
                "maindata": {
                    "field-1": {
                        "value": "ICSA BU Group Summary Report Submission Flow-Developer 1-2025-10-17"
                    },
                    "field-2": {
                        "value": "0",
                        "specialobj": [
                            {
                                "id": "0",
                                "isfc": "0",
                                "showorder": "1",
                                "customname": "正常",
                                "defaultname": "正常"
                            },
                            {
                                "id": "1",
                                "isfc": "0",
                                "showorder": "2",
                                "customname": "重要",
                                "defaultname": "重要"
                            },
                            {
                                "id": "2",
                                "isfc": "0",
                                "showorder": "3",
                                "customname": "紧急",
                                "defaultname": "紧急"
                            }
                        ]
                    },
                    "field-3": {
                        "value": "0"
                    },
                    "field-5": {
                        "value": "-1"
                    },
                    "field-9": {
                        "value": "0"
                    },
                    "field14453": {
                        "value": "506593",
                        "specialobj": [
                            {
                                "id": "506593",
                                "name": "ICSA Main Process-Developer 1-2025-10-17",
                                "count": 0
                            }
                        ]
                    },
                    "field14454": {
                        "value": "26085",
                        "specialobj": [
                            {
                                "id": "26085",
                                "name": "Developer 1",
                                "count": 0
                            }
                        ]
                    },
                    "field14455": {
                        "value": ""
                    },
                    "field14456": {
                        "value": ""
                    },
                    "field14457": {
                        "value": ""
                    },
                    "field14559": {
                        "value": ""
                    },
                    "field14576": {
                        "value": "9"
                    },
                    "field14582": {
                        "value": "",
                        "specialobj": {
                            "filedatas": [],
                            "showBatchLoad": false
                        }
                    },
                    "field14904": {
                        "value": "ICSA2025375"
                    },
                    "field14967": {
                        "value": "2025_10_17_3"
                    },
                    "field15006": {
                        "value": "2025-10-17",
                        "specialobj": [
                            {
                                "id": "2025-10-17",
                                "name": "2025-10-17",
                                "count": 0
                            }
                        ]
                    }
                },
                "odocInfo": {
                    "docFlag": false,
                    "replaceTagGroup": {
                        "142": [],
                        "285": []
                    }
                },
                "detailNum": 0,
                "tableInfo": {
                    "main": {
                        "recordnum": 533,
                        "tablename": "formtable_main_330",
                        "tableindex": -1,
                        "tablecolumn": "assessment,buchampion,budirector,bufinancehead,bugroup,entitysubmissionstatus,bu,summaryreport,casenumber,assessmentname,busubmissiondeadline,",
                        "fieldinfomap": {
                            "-1": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": -1,
                                "groupid": 0,
                                "htmltype": 1,
                                "isdetail": 0,
                                "viewattr": 0,
                                "detailtype": 1,
                                "fieldlabel": "标题",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "existLayout": false,
                                "fieldgroupid": 0
                            },
                            "-2": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": -2,
                                "groupid": 0,
                                "htmltype": 1,
                                "isdetail": 0,
                                "viewattr": 0,
                                "detailtype": 1,
                                "fieldlabel": "紧急程度",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "existLayout": false,
                                "fieldgroupid": 0
                            },
                            "-4": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": -4,
                                "groupid": 0,
                                "htmltype": 1,
                                "isdetail": 0,
                                "viewattr": 0,
                                "detailtype": 1,
                                "fieldlabel": "签字意见",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "existLayout": false,
                                "fieldgroupid": 0
                            },
                            "-9": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": -9,
                                "groupid": 0,
                                "htmltype": 1,
                                "isdetail": 0,
                                "viewattr": 0,
                                "detailtype": 1,
                                "fieldlabel": "打印次数",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "existLayout": false,
                                "fieldgroupid": 0
                            },
                            "-10": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": -10,
                                "groupid": 0,
                                "htmltype": 1,
                                "isdetail": 0,
                                "viewattr": 0,
                                "detailtype": 1,
                                "fieldlabel": "密级",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "existLayout": false,
                                "fieldgroupid": 0
                            },
                            "14453": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 14453,
                                "groupid": -1,
                                "htmltype": 3,
                                "isdetail": 0,
                                "viewattr": 1,
                                "fieldname": "assessment",
                                "detailtype": 16,
                                "fieldlabel": "Assessment",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "browserattr": {
                                    "isSingle": false,
                                    "browserParams": {}
                                },
                                "existLayout": true,
                                "fielddbtype": "int",
                                "fieldgroupid": 0
                            },
                            "14454": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 14454,
                                "groupid": -1,
                                "htmltype": 3,
                                "isdetail": 0,
                                "viewattr": 1,
                                "fieldname": "buchampion",
                                "detailtype": 1,
                                "fieldlabel": "BU Champion",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "browserattr": {
                                    "isSingle": false,
                                    "browserParams": {
                                        "defaultSearch": "false"
                                    }
                                },
                                "existLayout": true,
                                "fielddbtype": "int",
                                "fieldgroupid": 0
                            },
                            "14455": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 14455,
                                "groupid": -1,
                                "htmltype": 3,
                                "isdetail": 0,
                                "viewattr": 3,
                                "fieldname": "budirector",
                                "detailtype": 1,
                                "fieldlabel": "BU Director",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "browserattr": {
                                    "isSingle": false,
                                    "browserParams": {
                                        "defaultSearch": "false"
                                    }
                                },
                                "existLayout": true,
                                "fielddbtype": "int",
                                "fieldgroupid": 0
                            },
                            "14456": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 14456,
                                "groupid": -1,
                                "htmltype": 3,
                                "isdetail": 0,
                                "viewattr": 3,
                                "fieldname": "bufinancehead",
                                "detailtype": 1,
                                "fieldlabel": "BU Finance Head",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "browserattr": {
                                    "isSingle": false,
                                    "browserParams": {
                                        "defaultSearch": "false"
                                    }
                                },
                                "existLayout": true,
                                "fielddbtype": "int",
                                "fieldgroupid": 0
                            },
                            "14457": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 14457,
                                "groupid": -1,
                                "htmltype": 5,
                                "isdetail": 0,
                                "viewattr": 0,
                                "fieldname": "bugroup",
                                "detailtype": 1,
                                "fieldlabel": "DEL-BU Group",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "selectattr": {
                                    "childfieldid": -1,
                                    "fieldshowtypes": 1,
                                    "selectitemlist": [
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "DCH GENERAL",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 1,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "EA",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 2,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Food HK",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 3,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Food PRC",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 4,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Laputa",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 5,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Logistics (HK)",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 6,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Logistics (PRC)",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 7,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "MHKO",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 8,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Motor PRC",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 9,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "PRC Corporate",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 10,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        }
                                    ]
                                },
                                "textheight": 0,
                                "existLayout": false,
                                "fielddbtype": "int(11)",
                                "fieldgroupid": 0
                            },
                            "14559": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 14559,
                                "groupid": -1,
                                "htmltype": 5,
                                "isdetail": 0,
                                "viewattr": 2,
                                "fieldname": "entitysubmissionstatus",
                                "detailtype": 1,
                                "fieldlabel": "Entity Submission Status",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "selectattr": {
                                    "childfieldid": -1,
                                    "fieldshowtypes": 1,
                                    "selectitemlist": [
                                        {
                                            "cancel": 0,
                                            "isdefault": 1,
                                            "selectname": "Pending",
                                            "childitemid": "",
                                            "docCategory": "",
                                            "selectvalue": 0,
                                            "maxUploadSize": 0,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "All Submitted",
                                            "childitemid": "",
                                            "docCategory": "",
                                            "selectvalue": 1,
                                            "maxUploadSize": 0,
                                            "isAccordToSubCom": 0
                                        }
                                    ]
                                },
                                "textheight": 0,
                                "existLayout": true,
                                "fielddbtype": "int(11)",
                                "fieldgroupid": 0
                            },
                            "14576": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 14576,
                                "groupid": -1,
                                "htmltype": 5,
                                "isdetail": 0,
                                "viewattr": 1,
                                "fieldname": "bu",
                                "detailtype": 1,
                                "fieldlabel": "BU Group",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "selectattr": {
                                    "childfieldid": -1,
                                    "fieldshowtypes": 1,
                                    "selectitemlist": [
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Mainland China Motor",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 9,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "HK & Overseas Motor",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 8,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "HK Food",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 3,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Mainland China Food",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 4,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Electronic Appliances",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 2,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "HK, Macau & Hengqin Logistics",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 6,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Mainland China Logistics",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 7,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Healthcare",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 0,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 0,
                                            "isdefault": 0,
                                            "selectname": "Corporate",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 1,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 1,
                                            "isdefault": 0,
                                            "selectname": "Laputa",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 5,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        },
                                        {
                                            "cancel": 1,
                                            "isdefault": 0,
                                            "selectname": "PRC Corporate",
                                            "childitemid": "",
                                            "docCategory": "-1,-1,-1",
                                            "selectvalue": 10,
                                            "maxUploadSize": 5,
                                            "isAccordToSubCom": 0
                                        }
                                    ]
                                },
                                "textheight": 0,
                                "existLayout": true,
                                "fielddbtype": "int(11)",
                                "fieldgroupid": 0
                            },
                            "14582": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 14582,
                                "groupid": -1,
                                "fileattr": {
                                    "imgWidth": 0,
                                    "imgHeight": 0,
                                    "limitType": "",
                                    "issortable": true,
                                    "catelogType": 0,
                                    "docCategory": ",,125",
                                    "isresetname": true,
                                    "isautoupload": true,
                                    "showFilesize": true,
                                    "showFullName": true,
                                    "showSecLevel": true,
                                    "showUploader": true,
                                    "fileSecFormat": 0,
                                    "maxUploadSize": 50,
                                    "showUploadTime": true,
                                    "isshowclerarall": false,
                                    "selectedCateLog": "0"
                                },
                                "htmltype": 6,
                                "isdetail": 0,
                                "viewattr": 3,
                                "fieldname": "summaryreport",
                                "detailtype": 1,
                                "fieldlabel": "Summary Report",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "existLayout": true,
                                "fielddbtype": "text",
                                "fieldgroupid": 0
                            },
                            "14904": {
                                "qfws": 0,
                                "length": 255,
                                "fieldid": 14904,
                                "groupid": -1,
                                "htmltype": 1,
                                "isdetail": 0,
                                "viewattr": 0,
                                "fieldname": "casenumber",
                                "detailtype": 1,
                                "fieldlabel": "CaseNumber",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "existLayout": false,
                                "fielddbtype": "varchar(255)",
                                "fieldgroupid": 0
                            },
                            "14967": {
                                "qfws": 0,
                                "length": 255,
                                "fieldid": 14967,
                                "groupid": -1,
                                "htmltype": 1,
                                "isdetail": 0,
                                "viewattr": 1,
                                "fieldname": "assessmentname",
                                "detailtype": 1,
                                "fieldlabel": "Assessment",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "existLayout": true,
                                "fielddbtype": "varchar(255)",
                                "fieldgroupid": 0
                            },
                            "15006": {
                                "qfws": 0,
                                "length": 0,
                                "fieldid": 15006,
                                "groupid": -1,
                                "htmltype": 3,
                                "isdetail": 0,
                                "viewattr": 0,
                                "fieldname": "busubmissiondeadline",
                                "detailtype": 2,
                                "fieldlabel": "BU Submission Deadline",
                                "isalonerow": false,
                                "isonlyshow": 0,
                                "textheight": 0,
                                "browserattr": {
                                    "isSingle": false,
                                    "browserParams": {}
                                },
                                "existLayout": false,
                                "fielddbtype": "char(10)",
                                "fieldgroupid": 0
                            }
                        }
                    }
                },
                "linkageCfg": {
                    "colCalCfg": {},
                    "rowCalCfg": {
                        "rowCalAssignInfo": {}
                    },
                    "formulaCfg": {
                        "files": [],
                        "formulas": [],
                        "systemdatas": {}
                    },
                    "mainCalCfg": {},
                    "fieldSqlCfg": {},
                    "viewAttrCfg": {},
                    "dataInputCfg": {},
                    "fieldDateCfg": {},
                    "fieldMathCfg": {},
                    "transTypeCfg": {}
                },
                "promptInfo": {},
                "remindInfo": {
                    "value": "2",
                    "isShow": false,
                    "options": [
                        {
                            "key": "2",
                            "showname": "邮件提醒"
                        }
                    ],
                    "process": "流程提醒",
                    "viewAttr": 2
                },
                "browserInfo": {
                    "1": {
                        "icon": "icon-coms-hrm",
                        "tabs": [
                            {
                                "key": "1",
                                "name": "最近",
                                "isSearch": false,
                                "selected": false,
                                "showOrder": 0
                            },
                            {
                                "key": "2",
                                "name": "同部门",
                                "isSearch": false,
                                "selected": false,
                                "showOrder": 0
                            },
                            {
                                "key": "3",
                                "name": "我的下属",
                                "isSearch": false,
                                "selected": false,
                                "showOrder": 0
                            },
                            {
                                "key": "4",
                                "name": "组织结构",
                                "isSearch": false,
                                "selected": false,
                                "showOrder": 0
                            },
                            {
                                "key": "5",
                                "name": "常用组",
                                "isSearch": false,
                                "selected": false,
                                "showOrder": 0
                            },
                            {
                                "key": "6",
                                "name": "所有人",
                                "isSearch": false,
                                "selected": false,
                                "showOrder": 0
                            }
                        ],
                        "type": "1",
                        "title": "人力资源",
                        "linkUrl": "/spa/hrm/index_mobx.html#/main/hrm/card/cardInfo/",
                        "scrollx": false,
                        "isDetail": 0,
                        "isSingle": true,
                        "pageSize": 10,
                        "viewAttr": 2,
                        "hasAddBtn": false,
                        "hasBorder": false,
                        "noOperate": true,
                        "dataParams": {},
                        "asynLoadAll": false,
                        "handleTypes": "",
                        "iconBgcolor": "#217346",
                        "idSeparator": ",",
                        "otherParams": {},
                        "replaceDatas": [],
                        "searchParams": {},
                        "checkStrictly": true,
                        "mobileLinkUrl": "/spa/hrm/static4mobile/index.html#/resourceInfo/~~~itemKeyHolder~~~",
                        "completeParams": {},
                        "destDataParams": {},
                        "hideVirtualOrg": false,
                        "isAutoComplete": 1,
                        "isMultCheckbox": false,
                        "replaceNotCtrl": false,
                        "expandfirstnode": false,
                        "quickSearchName": "",
                        "hasAdvanceSerach": true,
                        "hasTabConditions": false,
                        "hideAdvanceSearch": false,
                        "searchPlaceholder": "",
                        "showCheckStrictly": true,
                        "conditionDataParams": {},
                        "defaultCheckStrictly": true,
                        "defaultExpandedLevel": 1
                    },
                    "2": {
                        "type": "2",
                        "title": "日期",
                        "linkUrl": "",
                        "scrollx": false,
                        "isDetail": 0,
                        "isSingle": true,
                        "pageSize": 10,
                        "viewAttr": 2,
                        "hasAddBtn": false,
                        "hasBorder": false,
                        "noOperate": true,
                        "dataParams": {},
                        "asynLoadAll": false,
                        "handleTypes": "",
                        "idSeparator": ",",
                        "otherParams": {},
                        "replaceDatas": [],
                        "searchParams": {},
                        "checkStrictly": true,
                        "mobileLinkUrl": "",
                        "completeParams": {},
                        "destDataParams": {},
                        "hideVirtualOrg": false,
                        "isAutoComplete": 1,
                        "isMultCheckbox": false,
                        "replaceNotCtrl": false,
                        "expandfirstnode": false,
                        "quickSearchName": "",
                        "hasAdvanceSerach": true,
                        "hasTabConditions": false,
                        "hideAdvanceSearch": false,
                        "searchPlaceholder": "",
                        "showCheckStrictly": true,
                        "conditionDataParams": {},
                        "defaultCheckStrictly": true,
                        "defaultExpandedLevel": 0
                    },
                    "16": {
                        "tabs": [
                            {
                                "key": "1",
                                "name": "全部",
                                "isSearch": false,
                                "selected": false,
                                "showOrder": 0
                            },
                            {
                                "key": "2",
                                "name": "我的收藏",
                                "isSearch": false,
                                "selected": false,
                                "showOrder": 0,
                                "dataParams": {
                                    "collReq": "1"
                                }
                            }
                        ],
                        "type": "16",
                        "title": "流程",
                        "linkUrl": "/workflow/request/ViewRequestForwardSPA.jsp?isrequest=1&authStr=dmlld0NoYWluPTUwNjU5NHxtYWluaWQ9NTA2NTk0fA==&authSignatureStr=a351b19481638e1fae787a780646e725&f_weaver_belongto_userid=19831&f_weaver_belongto_usertype=0",
                        "scrollx": false,
                        "isDetail": 0,
                        "isSingle": true,
                        "pageSize": 10,
                        "viewAttr": 2,
                        "hasAddBtn": false,
                        "hasBorder": false,
                        "noOperate": true,
                        "dataParams": {},
                        "asynLoadAll": false,
                        "handleTypes": "",
                        "idSeparator": ",",
                        "otherParams": {},
                        "replaceDatas": [],
                        "searchParams": {},
                        "checkStrictly": true,
                        "mobileLinkUrl": "",
                        "completeParams": {},
                        "destDataParams": {},
                        "hideVirtualOrg": false,
                        "isAutoComplete": 1,
                        "isMultCheckbox": false,
                        "replaceNotCtrl": false,
                        "expandfirstnode": false,
                        "quickSearchName": "",
                        "hasAdvanceSerach": true,
                        "hasTabConditions": true,
                        "hideAdvanceSearch": false,
                        "searchPlaceholder": "",
                        "showCheckStrictly": true,
                        "conditionDataParams": {},
                        "defaultCheckStrictly": true,
                        "defaultExpandedLevel": 0
                    }
                },
                "promptInfos": [],
                "propFileCfg": {
                    "script_debug": "0",
                    "htmltopdf_usewk": "1",
                    "tri_formula_all": "0",
                    "form_sign_cellbr": "0",
                    "mobile_showchart": "0",
                    "open_server_eval": "0",
                    "prohibitDownload": "0",
                    "tri_rowRule_edit": "0",
                    "tri_rowRule_view": "0",
                    "closeAutoComplete": "0",
                    "mobile_show_radio": "0",
                    "show_duration_log": "0",
                    "batchPrintByModeid": "0",
                    "operated_show_type": "0",
                    "print_show_allTabs": "0",
                    "tri_dataInput_main": "0",
                    "wf_overtime_remind": "",
                    "amount_convert_unit": "0",
                    "colRule_noRow_empty": "0",
                    "detail_prepage_size": "10",
                    "files_link_onlyview": "0",
                    "form_customer_share": "1",
                    "tri_dateTime_detail": "1",
                    "tri_fieldSql_detail": "1",
                    "form_allowAllPersion": "1",
                    "form_open_dataverify": "0",
                    "isImportBrowserField": "0",
                    "mobile_show_checkbox": "0",
                    "rowRule_addRow_empty": "0",
                    "tri_dataInput_detail": "0",
                    "wf_selectflow_reject": "0",
                    "workflow_pdffont_dir": "1~~weaversplit~~/font/workflow/pdf",
                    "always_show_signinput": "1",
                    "error_remind_workflow": "",
                    "form_openAutoForecast": "1",
                    "split_req_linkageData": "0",
                    "close_duration_storage": "0",
                    "forward_submitaddshare": "1",
                    "record_largefields_log": "0",
                    "use_textarea_signinput": "0",
                    "wf_selectflow_signtype": "3",
                    "create_request_open_ofs": "1",
                    "detail_hideArea_control": "0",
                    "form_image_scalingRatio": "90",
                    "use_batch_submit_remark": "1",
                    "workflowtodoc_useitext7": "0",
                    "write_linkage_log_range": "",
                    "autocomplete_change_name": "0",
                    "detail_locked_button_row": "1",
                    "batch_print_control_width": "1000",
                    "enable_no_promptes_submit": "0",
                    "request_batchsubmit_async": "1",
                    "Intelligent_analysis_range": "0",
                    "bill_monthOrWeek_flow_flag": "1",
                    "communicationInputOvertime": "10",
                    "file_download_use_docright": "0",
                    "print_signList_black_color": "0",
                    "req_async_saveoperationlog": "0",
                    "FieldSqlResultOutOfLimitNum": "3000",
                    "Intelligent_analysis_switch": "1",
                    "browser_color_controlByCell": "0",
                    "form_image_handWritingBrush": "md",
                    "form_image_handWritingColor": "#010102",
                    "form_showAutoForecastResult": "1,2",
                    "handwriting_download_switch": "0",
                    "req_async_updaterequestname": "0",
                    "support_html_textarea_field": "field6_0",
                    "DatainputResultOutOfLimitNum": "2000",
                    "rightbtn_enable_after_script": "0",
                    "workflowtodoc_watermark_font": "msyh.ttf",
                    "wbservice_delreq_verify_right": "1",
                    "form_image_handWritingMaxWidth": "",
                    "form_image_handWritingShowType": "1",
                    "nodeoperator_sortbyselectedkey": "0",
                    "un_use_customize_browser_cache": "0",
                    "form_image_handWritingMaxHeight": "",
                    "workflowtodoc_watermark_fontsize": "12",
                    "workflowtodoc_watermark_fontcolor": "128,128,128",
                    "Intelligent_analysis_workflow_path": "",
                    "export_excel_with_separated_sheets": "1",
                    "htmltopdf_orientation_landscape_wfids": "all"
                },
                "durationTime": 135,
                "secLevelInfo": {
                    "isOpenSec": false
                },
                "submitParams": {
                    "src": "",
                    "billid": 533,
                    "formid": -330,
                    "isbill": "1",
                    "nodeid": 657,
                    "topage": "",
                    "authStr": "dmlld0NoYWluPTUwNjU5NHxtYWluaWQ9NTA2NTk0fA==",
                    "creater": 26085,
                    "isCptwf": false,
                    "iscreate": "0",
                    "isdialog": "1",
                    "isremark": "0",
                    "nodetype": "2",
                    "agentType": 0,
                    "createdoc": "",
                    "needcheck": "",
                    "requestid": 506594,
                    "inputcheck": "",
                    "isMultiDoc": "",
                    "isovertime": "",
                    "lastnodeid": "",
                    "needwfback": "",
                    "uploadType": "",
                    "workflowid": 111,
                    "RejectNodes": "",
                    "comemessage": "",
                    "creatertype": 0,
                    "currentdate": "2026-04-22",
                    "currenttime": "15:10:28",
                    "fromFlowDoc": "",
                    "linkageUUID": "3DACD5C14CD04874B8660B000D293C12",
                    "remindTypes": "2",
                    "takisremark": 0,
                    "RejectToType": "",
                    "htmlfieldids": "",
                    "lastOperator": 26085,
                    "needoutprint": "",
                    "workflowtype": "47",
                    "isWorkflowDoc": false,
                    "needcheckLock": "false",
                    "RejectToNodeid": "",
                    "SubmitToNodeid": "",
                    "edesign_layout": "",
                    "remarkLocation": "",
                    "isFormSignature": 0,
                    "isSignMustInput": "",
                    "lastOperateDate": "2025-10-17",
                    "lastOperateTime": "16:31:06",
                    "agentorByAgentId": -1,
                    "authSignatureStr": "a351b19481638e1fae787a780646e725",
                    "selectfieldvalue": "",
                    "isSubmitDirectNode": "",
                    "openByDefaultBrowser": "",
                    "workflowRequestLogId": "",
                    "annexmaxUploadImageSize": "",
                    "f_weaver_belongto_userid": "19831",
                    "temphasUseTempletSucceed": "",
                    "f_weaver_belongto_usertype": "0",
                    "19831_506594_request_submit_token": 1776841828519
                },
                "secondAuthInfo": {}
            },
            "isE9Save": true,
            "userRight": true,
            "processInfo": {
                "remark": "",
                "status": "Pending",
                "canEdit": true,
                "canView": true,
                "creatorId": "26085",
                "requestId": "506594",
                "createTime": "2025-10-17 16:31:06",
                "creatorName": "Developer 1",
                "messageType": "0",
                "requestName": "ICSA BU Group Summary Report Submission Flow-Developer 1-2025-10-17",
                "requestLevel": "0",
                "currentNodeId": "657",
                "needAffirmance": true,
                "currentNodeName": "Upload and submit Report Outline",
                "lastOperateTime": "2025-10-17 16:31:06",
                "mustInputRemark": false,
                "lastOperatorName": "",
                "rejectButtonName": "",
                "submitButtonName": "提交",
                "workflowBaseInfo": {
                    "workflowId": "111",
                    "workflowName": "ICSA BU Group Summary Report Submission Flow",
                    "workflowTypeId": "47",
                    "workflowTypeName": "GICRM - Internal Control Self-Assessment"
                },
                "workflowHtmlShow": [
                    null,
                    null
                ],
                "forwardButtonName": "转发",
                "subbackButtonName": "",
                "subnobackButtonName": "",
                "workflowRequestLogs": [
                    {
                        "id": "210467",
                        "nodeId": "655",
                        "remark": "",
                        "nodeName": "Created by GICRM",
                        "operatorId": "26085",
                        "operateDate": "2025-10-17",
                        "operateTime": "16:31:06",
                        "operateType": "提交",
                        "operatorDept": "Prof Svc-Low Code Platform",
                        "operatorName": "Developer 1",
                        "signDocHtmls": "",
                        "annexDocHtmls": "",
                        "receivedPersons": "Developer 1,Peihong Admin,ICSA 01,chen xiangzi,shu yaojin,ICSA Test Admin",
                        "signWorkFlowHtmls": ""
                    }
                ],
                "workflowHtmlTemplete": [
                    null,
                    null
                ],
                "workflowMainTableInfo": {
                    "tableDBName": "formtable_main_330",
                    "requestRecords": [
                        {
                            "recordOrder": 0,
                            "workflowRequestTableFields": [
                                {
                                    "edit": false,
                                    "mand": true,
                                    "view": true,
                                    "fieldId": "-1",
                                    "fieldName": "requestname",
                                    "fieldType": "",
                                    "fieldOrder": -1,
                                    "fieldValue": "ICSA BU Group Summary Report Submission Flow-Developer 1-2025-10-17",
                                    "fieldDBType": "",
                                    "fieldFormName": "requestname",
                                    "fieldHtmlType": "1",
                                    "fieldShowName": "标题",
                                    "filedHtmlShow": "ICSA BU Group Summary Report Submission Flow-Developer 1-2025-10-17",
                                    "fieldShowValue": "ICSA BU Group Summary Report Submission Flow-Developer 1-2025-10-17"
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": true,
                                    "fieldId": "-2",
                                    "fieldName": "requestlevel",
                                    "fieldType": "",
                                    "fieldOrder": -2,
                                    "fieldValue": "0",
                                    "fieldDBType": "",
                                    "selectnames": [
                                        "正常",
                                        "重要",
                                        "紧急"
                                    ],
                                    "selectvalues": [
                                        "0",
                                        "1",
                                        "2"
                                    ],
                                    "fieldFormName": "requestlevel",
                                    "fieldHtmlType": "5",
                                    "fieldShowName": "",
                                    "filedHtmlShow": "正常",
                                    "fieldShowValue": "正常"
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": false,
                                    "fieldId": "-3",
                                    "fieldName": "messageType",
                                    "fieldType": "",
                                    "fieldOrder": -3,
                                    "fieldValue": "0",
                                    "fieldDBType": "",
                                    "selectnames": [
                                        "不短信提醒",
                                        "离线短信提醒",
                                        "在线短信提醒"
                                    ],
                                    "selectvalues": [
                                        "0",
                                        "1",
                                        "2"
                                    ],
                                    "fieldFormName": "messageType",
                                    "fieldHtmlType": "5",
                                    "fieldShowName": "短信提醒",
                                    "filedHtmlShow": "",
                                    "fieldShowValue": "不短信提醒"
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": false,
                                    "fieldId": "14904",
                                    "fieldName": "casenumber",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 0,
                                    "fieldValue": "ICSA2025375",
                                    "fieldDBType": "varchar(255)",
                                    "selectnames": [],
                                    "selectvalues": [],
                                    "fieldFormName": "field14904",
                                    "fieldHtmlType": "1",
                                    "fieldShowName": "CaseNumber",
                                    "filedHtmlShow": "ICSA2025375",
                                    "fieldShowValue": "ICSA2025375"
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": true,
                                    "fieldId": "14453",
                                    "fieldName": "assessment",
                                    "fieldType": "16",
                                    "browserurl": "",
                                    "fieldOrder": 1,
                                    "fieldValue": "506593",
                                    "fieldDBType": "int",
                                    "selectnames": [],
                                    "selectvalues": [],
                                    "fieldFormName": "field14453",
                                    "fieldHtmlType": "3",
                                    "fieldShowName": "Assessment",
                                    "filedHtmlShow": "<a style='text-decoration:underline' href=\"javascript:toRequest(506593);\">ICSA Main Process-Developer 1-2025-10-17</a><br/>",
                                    "fieldShowValue": "<a style='text-decoration:underline' href=\"javascript:toRequest(506593);\">ICSA Main Process-Developer 1-2025-10-17</a><br/>"
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": true,
                                    "fieldId": "14967",
                                    "fieldName": "assessmentname",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 2,
                                    "fieldValue": "2025_10_17_3",
                                    "fieldDBType": "varchar(255)",
                                    "selectnames": [],
                                    "selectvalues": [],
                                    "fieldFormName": "field14967",
                                    "fieldHtmlType": "1",
                                    "fieldShowName": "Assessment",
                                    "filedHtmlShow": "2025_10_17_3",
                                    "fieldShowValue": "2025_10_17_3"
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": true,
                                    "fieldId": "14576",
                                    "fieldName": "bu",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 3,
                                    "fieldValue": "9",
                                    "fieldDBType": "int(11)",
                                    "selectnames": [
                                        "Mainland China Motor",
                                        "HK & Overseas Motor",
                                        "HK Food",
                                        "Mainland China Food",
                                        "Electronic Appliances",
                                        "HK, Macau & Hengqin Logistics",
                                        "Mainland China Logistics",
                                        "Healthcare",
                                        "Corporate",
                                        "Laputa",
                                        "PRC Corporate"
                                    ],
                                    "selectvalues": [
                                        "9",
                                        "8",
                                        "3",
                                        "4",
                                        "2",
                                        "6",
                                        "7",
                                        "0",
                                        "1",
                                        "5",
                                        "10"
                                    ],
                                    "fieldFormName": "field14576",
                                    "fieldHtmlType": "5",
                                    "fieldShowName": "BU Group",
                                    "filedHtmlShow": "Mainland China Motor",
                                    "fieldShowValue": "Mainland China Motor"
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": false,
                                    "fieldId": "14457",
                                    "fieldName": "bugroup",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 4,
                                    "fieldValue": "",
                                    "fieldDBType": "int(11)",
                                    "selectnames": [
                                        "DCH GENERAL",
                                        "EA",
                                        "Food HK",
                                        "Food PRC",
                                        "Laputa",
                                        "Logistics (HK)",
                                        "Logistics (PRC)",
                                        "MHKO",
                                        "Motor PRC",
                                        "PRC Corporate"
                                    ],
                                    "selectvalues": [
                                        "1",
                                        "2",
                                        "3",
                                        "4",
                                        "5",
                                        "6",
                                        "7",
                                        "8",
                                        "9",
                                        "10"
                                    ],
                                    "fieldFormName": "field14457",
                                    "fieldHtmlType": "5",
                                    "fieldShowName": "DEL-BU Group",
                                    "filedHtmlShow": "",
                                    "fieldShowValue": ""
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": true,
                                    "fieldId": "14454",
                                    "fieldName": "buchampion",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 5,
                                    "fieldValue": "26085",
                                    "fieldDBType": "int",
                                    "selectnames": [],
                                    "selectvalues": [],
                                    "fieldFormName": "field14454",
                                    "fieldHtmlType": "3",
                                    "fieldShowName": "BU Champion",
                                    "filedHtmlShow": "Developer 1 ",
                                    "fieldShowValue": "Developer 1 "
                                },
                                {
                                    "edit": true,
                                    "mand": true,
                                    "view": true,
                                    "fieldId": "14455",
                                    "fieldName": "budirector",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 6,
                                    "fieldValue": "",
                                    "fieldDBType": "int",
                                    "selectnames": [],
                                    "selectvalues": [],
                                    "fieldFormName": "field14455",
                                    "fieldHtmlType": "3",
                                    "fieldShowName": "BU Director",
                                    "filedHtmlShow": "<table style=\"width:100%;\"><tr><td style=\"width:10%;\" onclick=\"javascript:showDialog('/browser/dialog.do','&returnIdField=budirector&returnShowField=budirector_span&method=listUser&isMuti=0')\"><a href=\"#\" data-rel=\"dialog\" data-transition=\"pop\"><div style=\"background-image:url('/images/search_icon_wev8.png');height:30px;width:30px;\"></div></a><input type=\"hidden\" name=\"field14455\" id=\"budirector\" value=\"\"/></td><td id=\"budirector_span\" style=\"width:90%;white-space:normal;\" align=\"left\"></td><td><span id=\"budirector_ismandspan\" class=\"ismand\">!</span><input type=\"hidden\" id=\"ismandfield\" name=\"ismandfield\" value=\"budirector\"/></td></tr></table>",
                                    "fieldShowValue": ""
                                },
                                {
                                    "edit": true,
                                    "mand": true,
                                    "view": true,
                                    "fieldId": "14456",
                                    "fieldName": "bufinancehead",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 7,
                                    "fieldValue": "",
                                    "fieldDBType": "int",
                                    "selectnames": [],
                                    "selectvalues": [],
                                    "fieldFormName": "field14456",
                                    "fieldHtmlType": "3",
                                    "fieldShowName": "BU Finance Head",
                                    "filedHtmlShow": "<table style=\"width:100%;\"><tr><td style=\"width:10%;\" onclick=\"javascript:showDialog('/browser/dialog.do','&returnIdField=bufinancehead&returnShowField=bufinancehead_span&method=listUser&isMuti=0')\"><a href=\"#\" data-rel=\"dialog\" data-transition=\"pop\"><div style=\"background-image:url('/images/search_icon_wev8.png');height:30px;width:30px;\"></div></a><input type=\"hidden\" name=\"field14456\" id=\"bufinancehead\" value=\"\"/></td><td id=\"bufinancehead_span\" style=\"width:90%;white-space:normal;\" align=\"left\"></td><td><span id=\"bufinancehead_ismandspan\" class=\"ismand\">!</span><input type=\"hidden\" id=\"ismandfield\" name=\"ismandfield\" value=\"bufinancehead\"/></td></tr></table>",
                                    "fieldShowValue": ""
                                },
                                {
                                    "edit": true,
                                    "mand": false,
                                    "view": true,
                                    "fieldId": "14559",
                                    "fieldName": "entitysubmissionstatus",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 8,
                                    "fieldValue": "",
                                    "fieldDBType": "int(11)",
                                    "selectnames": [
                                        "Pending",
                                        "All Submitted"
                                    ],
                                    "selectvalues": [
                                        "0",
                                        "1"
                                    ],
                                    "fieldFormName": "field14559",
                                    "fieldHtmlType": "5",
                                    "fieldShowName": "Entity Submission Status",
                                    "filedHtmlShow": "<table style=\"width:100%;\"><tr><td style=\"width:99%;white-space:normal;\" align=\"left\"><select name=\"field14559\" id=\"entitysubmissionstatus\"><option value=\"\" selected></option><option value=\"0\" >Pending</option><option value=\"1\" >All Submitted</option></select></td></tr></table>",
                                    "fieldShowValue": ""
                                },
                                {
                                    "edit": true,
                                    "mand": true,
                                    "view": true,
                                    "fieldId": "14582",
                                    "fieldName": "summaryreport",
                                    "fieldType": "1",
                                    "browserurl": "",
                                    "fieldOrder": 9,
                                    "fieldValue": "",
                                    "fieldDBType": "text",
                                    "selectnames": [],
                                    "selectvalues": [],
                                    "fieldFormName": "field14582",
                                    "fieldHtmlType": "6",
                                    "fieldShowName": "Summary Report",
                                    "filedHtmlShow": "<span style='color:#ACA899'>[该字段暂不支持]</span>",
                                    "fieldShowValue": "<span style='color:#ACA899'>[该字段暂不支持]</span>"
                                },
                                {
                                    "edit": false,
                                    "mand": false,
                                    "view": false,
                                    "fieldId": "15006",
                                    "fieldName": "busubmissiondeadline",
                                    "fieldType": "2",
                                    "browserurl": "",
                                    "fieldOrder": 10,
                                    "fieldValue": "2025-10-17",
                                    "fieldDBType": "char(10)",
                                    "selectnames": [],
                                    "selectvalues": [],
                                    "fieldFormName": "field15006",
                                    "fieldHtmlType": "3",
                                    "fieldShowName": "BU Submission Deadline",
                                    "filedHtmlShow": "2025-10-17",
                                    "fieldShowValue": "2025-10-17"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    try {
        const body: Record<string, any> = await readBody<Record<string, any>>(event).catch(() => ({}))
        const notificationApiPrefix = '/api/r/internal'
        const response = await $fetch.raw<Record<string, unknown>>(`${config.public.apiBase}${notificationApiPrefix}/ecology_oa/workflow_form`, {
            method: 'POST',
            headers: getForwardHeaders(event),
            body: {
                requestid: body.requestid ?? body.requestId,
            },
        })

        forwardSetCookieHeaders(event, response)

        return {
            success: true,
            data: response._data,
        }
    }
    catch (error: any) {
        console.error('Workflow form API error:', {
            statusCode: error?.statusCode || error?.status,
            statusMessage: error?.statusMessage || error?.message,
            data: error?.data,
        })

        throw createError({
            statusCode: error?.statusCode || error?.status || 500,
            statusMessage: error?.statusMessage || error?.message || 'Workflow form API failed',
            data: error?.data,
        })
    }
}
)
