#!/bin/sh


grep "categories:" _posts/*.md | awk -F\[ '{print $2}' | sed s/]$//g | sed s/,/\ /g | while read cts
do
	for category in ${cts}
	do
		if [ "x${category}" != "x" ] ; then
			cfilename=category/${category}.md

			if [ -f ${cfilename} ] ; then continue; fi
			echo '---' > ${cfilename}
			echo 'layout: posts_by_category' >> ${cfilename}
			echo 'categories: '${category} >> ${cfilename}
			echo 'title: '${category} >> ${cfilename}
			echo 'permalink: /category/'${category} >> ${cfilename}
			echo '---' >> ${cfilename}
		fi
	done
done
