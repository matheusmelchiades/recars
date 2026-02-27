read -s -p "USER: " user
printf "\n"
read -s -p "PASSWORD: " pass
printf "\n"

mongoexport -h ds155815.mlab.com:55815 -d carsdb -c api_brands -u $user -p $pass -o 'backup/brands.json' $@
mongoexport -h ds155815.mlab.com:55815 -d carsdb -c api_models -u $user -p $pass -o 'backup/models.json' $@
mongoexport -h ds155815.mlab.com:55815 -d carsdb -c api_years -u $user -p $pass -o 'backup/years.json' $@
mongoexport -h ds155815.mlab.com:55815 -d carsdb -c api_cars -u $user -p $pass -o 'backup/cars.json' $@

