/// <reference path="../../typings/tsd.d.ts" />

import request = require('request');
import cheerio from 'cheerio';

/**
 * Example controller that provides a healthcheck endpoint
 */
module ScrapeHome {

    var localTest = true;
    var testHtml = '<table border="1" align="center"> <tr> <th>State/Region</th> <th>Latest Swim Meet</th> <th>SCY Swimmers</th> <th>LCM Swimmers</th> </tr> <td><button onclick="location.href=\'http://www.swimmingrank.com/aft/index.html\'">Alabama-Florida-Tennesee</button></td> <td>CVST Blue/Green Meet (4/22/2016)</td> <td>17599</td> <td>3076</td> </tr> <td><button onclick="location.href=\'http://www.swimmingrank.com/az/index.html\'">Arizona</button></td> <td>2016 AZ PSC LC Opener (4/2/2016)</td> <td>2904</td> <td>257</td> </tr>  </table>';
// var request = require('request');
    var cheerio = require('cheerio');

    var urlHome = 'http://www.swimmingrank.com';

    var url = urlHome;
    var regionList = [];

    start()
    {
        if (localTest) {
            processRegionTable(testHtml);
            // foreach( reg in regionList) {
            //     processRegionLink(regionHtml);
            // }
        } else {
            request(url, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    processRegionTable(html);
                    // foreach( reg in regionList)
                    // {
                    //    url = reg.regionList;
                    //    request(url, function (error, response, html) {
                    //        if (!error && response.statusCode == 200) {
                    //            processRegionLink(html);
                    //        }
                    //    }
                    //    else {
                    //        console.log("We’ve encountered an error: " + error);
                    //    }
                }
            });
        }
    }

    processRegionTable(html)
    {
        var $ = cheerio.load(html);
        $('table').each(function (i, element) {

            if ($(this).find('th').first().text() === 'State/Region') {
                $(this).find('tr').each(function (i, elem) {
                    var td1 = $(elem).children().first();
                    // console.info('  data: ' + td1.data());
                    var region = td1.text();
                    if (region !== 'State/Region' && region !== 'Total') {
                        var link = td1.children('button').attr('onclick');
                        link = link.substring(15, link.length - 1); // location.href='
                        regionList.push({
                            region: td1.text(),
                            regionLink: link,
                            latestMeet: td1.next().text(),
                            scySwimmers: td1.next().next().text(),
                            lcmSwimmers: td1.next().next().next().text()
                        });
                    }
                });
            }
        });
        console.info('===> total region count: ' + regionList.length);
        console.info(JSON.stringify(regionList));
    }

// function processRegionLink(html) {
//    var $ = cheerio.load(html);
//    $('table').each(function(i, element){
//
//
//    }
}

export default ScrapeHome;
