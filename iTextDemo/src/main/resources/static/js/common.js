window.onload=function(){
	/*
		1) regist Id
	*/
	var target_id = [
		'include_header',
		'include_footer'
	];
	/*----------------------------------------------------------------------------------------------------*/
	/*
		2) markup
	*/
	var markup = [];

	var path = window.location.pathname;
	var page = path.split("/").pop();

	if (page.indexOf("accountDetails") >= 0) {
		markup['include_header'] = hereDoc(function() {
		/*
		<div class="head-container">
			<h1 class="homeLogo">iText7 デモ</h1>

            <div onclick="javascript:history.back(-1)" style="float: right; margin: 10px;">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
                    <g>
                        <g>
                            <path d="M384.834,180.699c-0.698,0-348.733,0-348.733,0l73.326-82.187c4.755-5.33,4.289-13.505-1.041-18.26
			c-5.328-4.754-13.505-4.29-18.26,1.041l-82.582,92.56c-10.059,11.278-10.058,28.282,0.001,39.557l82.582,92.561
			c2.556,2.865,6.097,4.323,9.654,4.323c3.064,0,6.139-1.083,8.606-3.282c5.33-4.755,5.795-12.93,1.041-18.26l-73.326-82.188
			c0,0,348.034,0,348.733,0c55.858,0,101.3,45.444,101.3,101.3s-45.443,101.3-101.3,101.3h-61.58
			c-7.143,0-12.933,5.791-12.933,12.933c0,7.142,5.79,12.933,12.933,12.933h61.58c70.12,0,127.166-57.046,127.166-127.166
			C512,237.745,454.954,180.699,384.834,180.699z" />
                        </g>
                    </g>
                </svg>
            </div>

			<div class="homeIcon" onclick="window.location = '/index'">
				<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 59.465 59.465" style="enable-background:new 0 0 59.465 59.465;" xml:space="preserve">
					<g>
						<g>
							<path d="M58.862,33.886L45.045,20.069v-9.112c0-1.136-0.921-2.056-2.056-2.056c-1.137,0-2.057,0.92-2.057,2.056v5.001L31.185,6.21
					c-0.801-0.803-2.104-0.803-2.905,0L0.603,33.886c-0.803,0.804-0.803,2.104,0,2.907c0.802,0.803,2.104,0.803,2.907,0L29.732,10.57
					l26.223,26.223c0.401,0.398,0.93,0.604,1.455,0.604c0.522,0,1.051-0.201,1.452-0.604C59.665,35.988,59.665,34.689,58.862,33.886z" />
							<path d="M52.979,36.245L31.185,14.449c-0.385-0.385-0.908-0.602-1.454-0.602c-0.545,0-1.068,0.217-1.453,0.602L6.484,36.245
					c-0.291,0.288-0.487,0.659-0.565,1.062c-0.061,0.314-0.091,0.633-0.091,0.942v10.638c0,2.739,2.229,4.971,4.969,4.971h10.638
					c1.378,0,2.707-0.582,3.645-1.599c0.854-0.923,1.324-2.12,1.324-3.373v-7.812c0-1.896,1.453-3.48,3.33-3.658
					c1.878,0.178,3.331,1.762,3.331,3.658v7.812c0,1.252,0.472,2.45,1.324,3.373c0.938,1.017,2.269,1.599,3.646,1.599h10.638
					c2.74,0,4.971-2.229,4.971-4.972V38.252c0-0.312-0.031-0.63-0.092-0.941C53.471,36.904,53.271,36.533,52.979,36.245z" />
						</g>
					</g>
				</svg>
			</div>
		</div>
		*/
		});
	} else {
		markup['include_header'] = hereDoc(function() {
		/*
		<div class="head-container">
			<h1 class="homeLogo">iText7 デモ</h1>
			<div class="homeIcon" onclick="window.location = '/index'">
				<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 59.465 59.465" style="enable-background:new 0 0 59.465 59.465;" xml:space="preserve">
					<g>
						<g>
							<path d="M58.862,33.886L45.045,20.069v-9.112c0-1.136-0.921-2.056-2.056-2.056c-1.137,0-2.057,0.92-2.057,2.056v5.001L31.185,6.21
					c-0.801-0.803-2.104-0.803-2.905,0L0.603,33.886c-0.803,0.804-0.803,2.104,0,2.907c0.802,0.803,2.104,0.803,2.907,0L29.732,10.57
					l26.223,26.223c0.401,0.398,0.93,0.604,1.455,0.604c0.522,0,1.051-0.201,1.452-0.604C59.665,35.988,59.665,34.689,58.862,33.886z" />
							<path d="M52.979,36.245L31.185,14.449c-0.385-0.385-0.908-0.602-1.454-0.602c-0.545,0-1.068,0.217-1.453,0.602L6.484,36.245
					c-0.291,0.288-0.487,0.659-0.565,1.062c-0.061,0.314-0.091,0.633-0.091,0.942v10.638c0,2.739,2.229,4.971,4.969,4.971h10.638
					c1.378,0,2.707-0.582,3.645-1.599c0.854-0.923,1.324-2.12,1.324-3.373v-7.812c0-1.896,1.453-3.48,3.33-3.658
					c1.878,0.178,3.331,1.762,3.331,3.658v7.812c0,1.252,0.472,2.45,1.324,3.373c0.938,1.017,2.269,1.599,3.646,1.599h10.638
					c2.74,0,4.971-2.229,4.971-4.972V38.252c0-0.312-0.031-0.63-0.092-0.941C53.471,36.904,53.271,36.533,52.979,36.245z" />
						</g>
					</g>
				</svg>
			</div>
		</div>
		*/
		});
	}

	markup['include_footer'] = hereDoc(function() {
	/*
	<div class="footer-container">
		<img src="image/RolandLogo.png">
	</div>
	*/
	});
	/*----------------------------------------------------------------------------------------------------*/
	/*
		3) add Common section
	*/
	for(var i = 0; i < target_id.length ; i++){
		if (document.getElementById(target_id[i])) {
			document.getElementById(target_id[i]).innerHTML = markup[target_id[i]];
		}
	}
	/*----------------------------------------------------------------------------------------------------*/
	/*
		4) hereDoc
		http://tomasz.janczuk.org/2013/05/multi-line-strings-in-javascript-and.html
		http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript/5571069#5571069
	*/
	function hereDoc(f) {
			var scriptEls = document.getElementsByTagName('script'),
					scriptSrc = scriptEls[scriptEls.length - 1].src,
					isIdx = /\?index$/.test(scriptSrc);

			return f.toString().
			replace(/^[^\/]+\/\*!?/, '').
			replace(/\*\/[^\/]+$/, '').
			replace(isIdx ? /="\.\.\//g : '', isIdx ? '="../' : '');
	}
}