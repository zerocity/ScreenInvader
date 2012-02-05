var xml_get_status_url = "http://10.20.30.51/cgi-bin/getstatus";
var xml_get_input_url = "http://10.20.30.51/cgi-bin/getinput";


var get_to_zero_volume = 805;

var local = false;
var urlprefix = '/';

var host = document.location.href;
if ( host.indexOf("localhost") != -1 || host.indexOf("file://") != -1 ) {
	local = true;
	urlprefix = '../';
}

$(document).ready( function ($) {
	var t = this;
	
	setInterval ( function () {
		var xml = t.xml;
		if ( !local ) {
			$.ajax({
				type: "GET",
				url: xml_get_status_url,
				dataType: "xml",
				success: function(xml) {
					renderXML ( xml, t );
					this.xml = xml;
					
					$(xml).find('Volume').each(function(){
						t.current_volume = $(this).find ( 'Val' ).text();
						
					});
				}
			});
		}else {
				renderXMLStats(xmlstats, t);		
		}
	}, 5000 );
	
	function renderXMLStats ( xml, t ) {
		
		$(xml).find('Volume').each(function(){
			var volume = $(this).find ( 'Val' );
			$('#volume-val').html( parseInt ( volume.text() ) + get_to_zero_volume);
			$('#db-val').html ( volume.text() * 0.1 );
			
			t.current_volume = volume.text();
			var muted = $(this).find ( 'Mute' );
			if ( muted == 'On' ) {
				$('#volume-mute').html('UnMute');
			} else if ( muted == 'Off' ) {
				$('#volume-mute').html('Mute');
			}
		});
		
		$(xml).find('Tone').each(function(){
			$(this).find('Bass').each(function(){
				var bass = $(this).find('Val').text();
				$('#bass-val').html( bass );
			});
			$(this).find('Treble').each(function(){
				var treble = $(this).find('Val').text();
				$('#treble-val').html( treble );
			});
		});
	}
});

/* -805 +165  dezibel range */

var xmlstats = '<YAMAHA_AV rsp="GET" RC="0"><Main_Zone><Basic_Status><Power_Control><Power>On</Power><Sleep>Off</Sleep></Power_Control><Volume><Lvl><Val>-185</Val><Exp>1</Exp><Unit>dB</Unit></Lvl><Mute>Off</Mute></Volume><Input><Input_Sel>AUDIO3</Input_Sel><Input_Sel_Item_Info><Param>AUDIO1</Param><RW>RW</RW><Title>AUDIO1</Title><Icon><On>/YamahaRemoteControl/Icons/icon002.png</On><Off></Off></Icon><Src_Name></Src_Name><Src_Number>1</Src_Number></Input_Sel_Item_Info></Input><Surround><Program_Sel><Current><Straight>Off</Straight><Enhancer>On</Enhancer><Sound_Program>7ch Stereo</Sound_Program></Current></Program_Sel><_3D_Cinema_DSP>Auto</_3D_Cinema_DSP><Dialogue_Lift>0</Dialogue_Lift></Surround><Pure_Direct><Mode>Off</Mode></Pure_Direct><Sound_Video><Tone><Bass><Val>50</Val><Exp>1</Exp><Unit>dB</Unit></Bass><Treble><Val>-50</Val><Exp>1</Exp><Unit>dB</Unit></Treble></Tone><Adaptive_DRC>Off</Adaptive_DRC></Sound_Video></Basic_Status></Main_Zone></YAMAHA_AV>';