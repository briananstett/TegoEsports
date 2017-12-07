#!/bin/bash
#NOTE: This script must be run as root

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

database="TeGoEsports"
source="/var/temp/$database/"

mongorestore --db "$database" --drop "$source" 
