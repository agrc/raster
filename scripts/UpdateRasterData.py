# Update_mapserv_fgds.py
# Pulls new data from sde to local file geodatabases on mapserv machines
#
# Scott Davis
# 8-23-11
# stdavis@utah.gov

# Updated 4-17-2013

import arcpy, os
from agrc import logging
from agrc import update
from agrc import email

fgdb = r'\\<server>\ArcGISServer\data\Raster\Raster.gdb'
sde = r'C:\PythonScripts\DatabaseConnections\DC_Indices@SGID10@gdb10.agrc.utah.gov.sde'
errors = []

logger = logging.Logger()
emailer = email.Emailer('stdavis@utah.gov')

class Runner(object):
    def run(self):
        try:
            self.start()
            logger.logMsg('\nScript completed successfully!')
        except arcpy.ExecuteError as e:
            logger.logMsg('arcpy.ExecuteError')
            logger.logError()
            logger.logGPMsg()
            emailer.sendEmail(logger.scriptName + ' - arcpy.ExecuteError', logger.log)
        except Exception as e:
            logger.logError()
            emailer.sendEmail(logger.scriptName + ' - Python Error', logger.log)
        finally:
            logger.writeLogToFile()

    def start(self):
        logger.logMsg("updating file geodatabase")
        value = update.updateFGDBfromSDE(fgdb, sde, logger)
        errors = value[0]
        changes = value[1]

        if len(errors) > 0:
            emailer.sendEmail(logger.scriptName + " - Update Errors",
                            "Updated Datasets: \n{}\n\nUpdate Errors:\n{}\n\nLog:\n{}".format("\n".join(changes),
                                                                                                      "\n\n".join(errors),
                                                                                                      logger.log))
        else:
            emailer.sendEmail(logger.scriptName + " - Success!",
                                   "Updated Datasets: \n{}\n\nLog:\n{}".format('\n'.join(changes),
                                   logger.log))

        print "done"

if __name__ == "__main__":
    Runner().run()
