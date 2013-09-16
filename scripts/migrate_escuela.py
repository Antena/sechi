# coding=utf8
from pymongo import MongoClient
from pymongo import ASCENDING, DESCENDING
import datetime

def main(args):
	mongo = MongoClient()
	db = mongo['sechi']
	resources = db['resources']
	for res in resources.find({}):
		print ""		
		ots = res['organizationTypes']['State']		
		print ots
		for ot in ots:
			if ot['label'] == 'Escuela':
				print ot['label'] = 'Institución Educativa'
		print ots

main('asd')
