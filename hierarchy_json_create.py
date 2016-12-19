#!/usr/bin/python
import json
import openpyxl
from openpyxl import load_workbook

print("Script to generate JSON object for hierarchical selection")

# load spreadsheet
wb = load_workbook('Book1.xlsx')
ws = wb['Sheet1']

# initialise JSON object
jsonObj = []

# iterate over rows in spreadsheet
for index, row in enumerate(ws.rows):
    # skip title row
    if index == 0:
       continue

    # get the values of each cell in the row
    object1 = row[0].value
    object2 = row[1].value
    object3 = row[2].value
    
    object1Found = False
    object2Found = False

    # if object1 and object2 are the same, then only 2 levels
    # are needed. Set object2 = object3 and set object3 to None.
    if object1 == object2:
        object2 = object3
        object3 = None
        
    # populate JSON object    
    for object in jsonObj:
        if object["name"] == object1:
            object1Found = True
            for child in object["children"]:
                if child["name"] == object2:
                    object2Found = True
                    if object3 is not None:
                        child["children"].append({"name": object3})
                        
            # if object2 hasn't previously been added, then add
            # a node for object2 and object3 (if given)
            if not object2Found:
                if object3 is None:
                    object["children"].append({"name": object2})
                else:
                    object["children"].append({"name": object2, "children": [{"name": object3}]})
                    
    # if object1 hasn't previously been added, then add
    # a node for object1, object2 and object3 (if given)
    if not object1Found:
        if object3 is None:
            jsonObj.append({"name": object1, "children": [{"name": object2}]})
        else:
            jsonObj.append({"name": object1, "children": [{"name": object2, "children": [{"name": object3}]}]})

print(jsonObj)
