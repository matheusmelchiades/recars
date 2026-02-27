read -s -p "USER: " user
printf "\n"
read -s -p "PASSWORD: " pass
printf "\n"

read -p "COLLECTION: " collection
printf "\n"


mongoexport -h ds155815.mlab.com:55815 -d carsdb -c $collection -u $user -p $pass -o "DATA_BASE/$collection.json" $@
