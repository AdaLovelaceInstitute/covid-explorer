import yaml

countries = ['AFG','BDI','BFA','BGD','CAF','CMR','COD','COL','ETH','HTI','IDN','IRN','IRQ','LBY','MLI','MMR','MOZ','NER','NGA','PHL','PSE','SDN','SOM','SSD','SYR',
'TCD',
'URK',
'VEN',
'YEM',
'ZWE']



with open('tree.yaml') as f:
    # use safe_load instead load
    dataMap = yaml.safe_load(f)