/*
	Cookie Consent

	Internal assets required:
		indexed_db.js
		notify.config.js
		notify.css
	External assets required:
		notify.js
*/
$( document ).ready(function() {

	var COOKIE_CONSENT_ACCEPTED = "COOKIE_CONSENT_ACCEPTED";

	function showCookieConsent() {
		console.log("cc / showCookieConsent -> ");
		var consentText = "Cookies help us deliver our Services. By using our website or clicking \"I consent\", you consent to our privacy policy and our use of cookies",
			consentHeader = "Cookie consent"

		if( typeof $.notify === 'undefined' ) {
			console.error( "cookie_consent is missing notify.js!" );
			alert( consentHeader + "\n" + consentText )
			DB.setKeyValue( COOKIE_CONSENT_ACCEPTED, true );
			return;
		}
		$.notify(
			{
				title: $("<span class=\"d-flex flex-column\">")
					.append( $("<h2>").text( consentHeader ))
					.append( $("<p>").attr( "class", "small text-left" ).text( consentText ))
					.append(
						$("<span class=\"d-flex flex-row justify-content-between align-items-center\">")
						.append( $( "<button>" ).text( "I consent" ).on( "click", function() {
							$( this ).trigger( 'notify-hide' );
							DB.setKeyValue( COOKIE_CONSENT_ACCEPTED, true );
						} ) )
						.append($( "<a>" ).attr( "class", "small" ).text( "Learn More" ).attr("href", "https://slimsim.heliohost.org/privacy_policy.html").attr( "target", "_blank" ))
					)
					
			},
			{
				style: 'html-info',
				autoHide: false,
				clickToHide: false
			}
		);

	} // end showCookieConsent();

	function checkToShowCookieConsent() {
		console.log("cc / checkToShowCookieConsent -> ");
		try {
			DB.getKeyValue( COOKIE_CONSENT_ACCEPTED, cookieConsentAccepted => {
				console.log("cc / checkToShowCookieConsent: cookieConsentAccepted = " + cookieConsentAccepted );
				if( cookieConsentAccepted === true ){
					return;
				}
				showCookieConsent();
			});
		} catch ( e ) {
			setTimeout( function() {
				checkToShowCookieConsent();
			}, 10);
		}
	}

	if( typeof DB === 'undefined' || DB.setKeyValue === undefined || DB.getKeyValue === undefined ) {
		console.error( "cookie_consent is missing indexed_db.js!" );
		showCookieConsent();
		return;
	}
	checkToShowCookieConsent();


});
