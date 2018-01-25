#!/bin/bash

# test in container
dockerapp_ynh_incontainer () {
        if [ -f /.dockerenv ]; then
                echo "0"
        else
                echo "1"
        fi
}

# check or do docker install
dockerapp_ynh_checkinstalldocker () {
	ret=$(sh _dockertest.sh)
	incontainer=$(dockerapp_ynh_incontainer)
        if [ $ret == 127 ]
	then
		# install
		start_docker="0"
		[ ! -e /var/run/docker.sock ] && [ -z ${DOCKER_HOST+x} ] && start_docker="1"
		curl -sSL https://get.docker.com | sh
		[ "$start_docker" == "1" ] && systemctl start docker && systemctl enable docker
		pip install docker-compose

		# retest
		ret=$(sh _dockertest.sh)
	fi

	if [ $ret != 0 ]
	then
		ynh_die "Sorry ! Your Docker deamon don't work ... Please check your system logs."
	fi

}

# find replace
dockerapp_ynh_findreplace () {
	for file in $(grep -rl "$2" "$1" 2>/dev/null)
	do
		ynh_replace_string "$2" "$3" "$file"
	done
}

dockerapp_ynh_findreplacepath () {
	dockerapp_ynh_findreplace docker/. "$1" "$2"
	dockerapp_ynh_findreplace ../conf/. "$1" "$2"
}

# find replace all variables
dockerapp_ynh_findreplaceallvaribles () {
	dockerapp_ynh_findreplacepath "YNH_APP" "$app"
        dockerapp_ynh_findreplacepath "YNH_DATA" "$data_path"
        dockerapp_ynh_findreplacepath "YNH_PORT" "$port"
        dockerapp_ynh_findreplacepath "YNH_PATH" "$path_url"
	bash docker/_specificvariablesapp.sh
}

# load variables
dockerapp_ynh_loadvariables () {
	data_path=/home/yunohost.docker/$app
	port=$(ynh_app_setting_get $app port)
	[ "$port" == "" ] && port=0
<% if (defaultPathOption != "") { %>	path_url=$(ynh_normalize_url_path $path)<% } else { %>	path_url=/<%}%>
	export architecture=$(dpkg --print-architecture)
	export incontainer=$(dockerapp_ynh_incontainer)
        docker_host=localhost
}

# copy conf app
dockerapp_ynh_copyconf () {
	mkdir -p $data_path
	cp -rf ../conf/app $data_path
}

# docker run
dockerapp_ynh_run () {
	ret=$(bash docker/run.sh)
	if [ "$ret" != "0" ]
	then
		# fix after yunohost restore iptables issue
		[ "$ret" == "125" ] && docker inspect $app | grep "Error" | grep -q "iptables failed" && systemctl restart docker && return 0
		ynh_die "Sorry ! App cannot start with docker. Please check docker logs."
	fi
}

# docker rm
dockerapp_ynh_rm () {
	ynh_replace_string "YNH_APP" "$app" docker/rm.sh
	bash docker/rm.sh
}

# Modify Nginx configuration file and copy it to Nginx conf directory
dockerapp_ynh_preparenginx () {
	# get port after container created
	port=$(docker port "$app" | awk -F':' '{print $NF}')
	ynh_app_setting_set $app port $port
	ynh_replace_string "__DOCKER_HOST__" "$docker_host" "../conf/nginx.conf"

<% if (defaultPathOption != "") { %>	if [ "$path_url" != "/" ]
	then
		ynh_replace_string "^#sub_path_only" "" "../conf/nginx.conf"
	fi
<% } %>
	ynh_add_nginx_config
}

# Regenerate SSOwat conf
dockerapp_ynh_reloadservices () {
	yunohost app ssowatconf
}
