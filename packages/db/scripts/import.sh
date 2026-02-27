read -s -p "USER: " user
printf "\n"
read -s -p "PASSWORD: " pass
printf "\n"
read -p "COLLECTION: " collection

mongoimport -h ds155815.mlab.com:55815 -d carsdb -c $collection -u $user -p $pass --file $1 $2