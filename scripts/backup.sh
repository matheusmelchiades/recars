read -s -p "USER: " user
printf '\n'
shift

read -s -p "PASSWORD: " pass
printf '\n'
shift

read -p "HOST_DB: " host
shift

read -p "DATABASE: " database
shift

mongodump -h ds245772.mlab.com:45772 -d carsdb_backup -u $user -p $pass -o '/tmp'
mongorestore -h $host -d $database -u $user -p $pass '/tmp/carsdb_backup'

rm -rf '/tmp/carsdb_backup'


