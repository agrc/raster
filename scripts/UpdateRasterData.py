import arcpy
from agrc import logging
from agrc import update
from agrc import messaging
from secrets import *

sde = r'SGID10 as INDICES.sde'
errors = []

logger = logging.Logger()
emailer = messaging.Emailer('stdavis@utah.gov')


def run():
    try:
        start()
        logger.logMsg('\nScript completed successfully!')
    except arcpy.ExecuteError:
        logger.logMsg('arcpy.ExecuteError')
        logger.logError()
        logger.logGPMsg()
        emailer.sendEmail(logger.scriptName + ' - arcpy.ExecuteError', logger.log)
    except Exception:
        logger.logError()
        emailer.sendEmail(logger.scriptName + ' - Python Error', logger.log)
    finally:
        logger.writeLogToFile()


def start():
    logger.logMsg("updating file geodatabase")
    value = update.updateFGDBfromSDE(FGDB, sde, logger)
    errors = value[0]
    changes = value[1]

    if len(errors) > 0:
        emailer.sendEmail(logger.scriptName + " - Update Errors",
                          "Updated Datasets: \n{}\n\nUpdate Errors:\n{}\n\nLog:\n{}".format("\n".join(changes),
                                                                                            "\n\n".join(errors),
                                                                                            logger.log))
    else:
        emailer.sendEmail(logger.scriptName + " - Success!",
                          "Updated Datasets: \n{}\n\nLog:\n{}".format('\n'.join(changes), logger.log))

    print "done"

if __name__ == "__main__":
    run()
