#!/bin/bash

#NOTE: This script requires either admin rights
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

database="TeGoEsports"
destinationDir="/var/temp/"

mongodump --db "$database" --out "$destinationDir"
