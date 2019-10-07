'''
This script use datatype lib to infer and 
return datatypes from uploaded dataset.
'''

import sys
from datatype import DataFrame

DATAFRAME = DataFrame.get_dataframe_from_csv(sys.argv[1])

DATAFRAME.infer_types()

print(DATAFRAME.types)
