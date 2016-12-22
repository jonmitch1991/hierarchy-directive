#!/usr/bin/python
import json
import openpyxl
from openpyxl import load_workbook

print("Script to generate SQL Insert statments for hierarchical selection")

# load spreadsheet
wb = load_workbook('Book1.xlsx')
ws = wb['Sheet1']

# initialise id count and JSON object
jsonObject = {}
id = 1

# iterate over rows in spreadsheet
for index, row in enumerate(ws.rows):
    # skip title row
    if index == 0:
       continue

    # get the values of each cell in the row
    object1 = row[0].value
    object2 = row[1].value
    object3 = row[2].value

    # if object1 and object2 are the same, then only 2 levels
    # are needed. Set object2 = object3 and
    # set object3 to None.
    if object1 == object2:
        object2 = object3
        object3 = None

    # populate JSON object with each action's name used as a key
    # for an object with the action's id, parent id (if applicable)
    # and child actions (if applicable)
    if object1 not in jsonObject:
        jsonObject[object1] = {}
        jsonObject[object1]["id"] = id
        jsonObject[object1]["children"] = {}
        id = id + 1

    if object2 not in jsonObject[object1]["children"]:
        parentId = jsonObject[object1]["id"]
        jsonObject[object1]["children"][object2] = {}
        jsonObject[object1]["children"][object2]["id"] = id
        jsonObject[object1]["children"][object2]["parentId"] = parentId
        jsonObject[object1]["children"][object2]["children"] = {}
        id = id + 1

    # if object3 is None then only 2 levels are needed,
    # so continue to the next action
    if object3 is None:
        continue

    if object3 not in jsonObject[object1]["children"][object2]["children"]:
        parentId = jsonObject[object1]["children"][object2]["id"]
        jsonObject[object1]["children"][object2]["children"][object3] = {}
        jsonObject[object1]["children"][object2]["children"][object3]["id"] = id
        jsonObject[object1]["children"][object2]["children"][object3]["parentId"] = parentId
        id = id + 1

# iterate over the JSON object and
# print SQL insert statements for each row
for object1Key in jsonObject:
    print("-- " + object1Key)
    object1 = jsonObject[object1Key]
    object1Id = object1["id"]
    print("INSERT INTO table (id, parent_id, title) VALUES ({}, null, '{}');".format(object1Id,object1Key))

    for object2Key in object1["children"]:
        object2 = object1["children"][object2Key]
        object2Id = object2["id"]
        object2ParentId = object2["parentId"]
        print("INSERT INTO table (id, parent_id, title) VALUES ({},{},'{}');".format(object2Id,object2ParentId,object2Key))

        for object3Key in object2["children"]:
            object3 = object2["children"][object3Key]
            object3Id = object3["id"]
            object3ParentId = object3["parentId"]
            print("INSERT INTO table (id, parent_id, title) VALUES ({},{}, '{}');".format(object3Id,object3ParentId,object3Key))
