function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // Toggle class "open" cho sidebar
    sidebar.classList.toggle('open');

    // Toggle class "shift" cho nội dung
    content.classList.toggle('shift');
}
function showContentByButton(number) {
  const content = {
    1: `<h4>Step 1</h4> 
        <h4>Configure the Management Interface</h4> 
        <p>From VLAN interface configuration mode, an IPv4 address and subnet mask 
        is applied to the management SVI of the switch. Specifically, SVI VLAN 99 will 
        be assigned the 172.17.99.11/24 IPv4 address and the 2001:db8:acad:99::1/64 
        IPv6 address as shown.</p>
        <p>Note: The SVI for VLAN 99 will not appear as “up/up” until VLAN 99 is created 
        and there is a device connected to a switch port associated with VLAN 99.</p>
        <p>Note: The switch may need to be configured for IPv6. For example, before you 
        can configure IPv6 addressing on a Cisco Catalyst 2960 running IOS version 15.0, 
        you will need to enter the global configuration command sdm prefer dual-ipv4-and-ipv6 
        default and then reload the switch.</p>
        <table>
          <tr>
            <th> Task </th>
            <th> 	IOS Commands </th>
          </tr>
          <tr>
            <td>Enter global configuration mode.</td>
            <td>S1# configure terminal</td>
          </tr>
          <tr>
            <td>Enter interface configuration mode for the SVI.</td>
            <td>S1(config)# interface vlan 99</td>
          </tr>
          <tr>
            <td>Configure the management interface IPv4 address.</td>
            <td>S1(config-if)# ip address 172.17.99.11 255.255.255.0</td>
          </tr>
          <tr>
            <td>Configure the management interface IPv6 address</td>
            <td>S1(config-if)# ipv6 address 2001:db8:acad:99::11/64</td>
          </tr>
          <tr>
            <td>Enable the management interface.</td>
            <td>S1(config-if)# no shutdown</td>
          </tr>
          <tr>
            <td>Return to the privileged EXEC mode.</td>
            <td>S1(config-if)# end</td>
          </tr>
          <tr>
            <td>Save the running config to the startup config.</td>
            <td>S1# copy running-config startup-config</td>
          </tr>
        </table>`
        ,
    2: `<h4>Step 2</h4>
        <h4>Configure the Default Gateway</h4> 
        <p>The switch should be configured with a default gateway if it will be managed remotely from networks that are not directly connected.</p>
        <p>Note: Because, it will receive its default gateway information from a router advertisement (RA) message, the switch does not require an IPv6 default gateway.</p>
         <table>
          <tr>
            <th> Task </th>
            <th> 	IOS Commands </th>
          </tr>
          <tr>
            <td>Enter global configuration mode.</td>
            <td>S1# configure terminal</td>
          </tr>
          <tr>
            <td>Configure the default gateway for the switch.</td>
            <td>S1(config)# ip default-gateway 172.17.99.1</td>
          </tr>
          <tr>
            <td>Return to the privileged EXEC mode.</td>
            <td>S1(config)# end</td>
          </tr>
          <tr>
            <td>Save the running config to the startup config.</td>
            <td>S1# copy running-config startup-config</td>
          </tr>
          </table>`,
    3: `<h4>Step 3</h4>
        <h4>Verify Configuration</h4>
        <p>The show ip interface brief and show ipv6 interface brief 
        commands are useful for determining the status of both physical 
        and virtual interfaces. The output shown confirms that interface
         VLAN 99 has been configured with an IPv4 and IPv6 address.</p>
         <p>Note: An IP address applied to the SVI is only for remote management 
         access to the switch; this does not allow the switch to route Layer 3 
         packets.</p>
         <img src="/blogs/img/06.png" alt="">`,
  };
  if (number == 1) {
    document.getElementById('s').innerHTML = content[1];
  } else if (number == 2) {
    document.getElementById('s').innerHTML = content[2];
  } else {
    document.getElementById('s').innerHTML = content[3];
  }
  
}
function configureSSH (number){
  const content = {
    1: `<h3>Step 1 <br> Verify SSH support.</h3>
        <p>Use the show ip ssh command to verify that the switch supports SSH. If the switch is not running an IOS that supports cryptographic features, this command is unrecognized.</p>
        <h4>S1# show ip ssh</h4>`,
    2: `<h3>Step 2 <br> Configure the IP domain.</h3>
        <p>Configure the IP domain name of the network using the ip domain-name domain-name global configuration mode command. In the figure, the domain-name value is cisco.com.</p>
        <h4>S1(config)# ip domain-name cisco.com</h4>`,
    3: `<h3>Step 3 <br> Generate RSA key pairs.</h3>
        <p>Not all versions of the IOS default to SSH version 2, and SSH version 1 has known security flaws. To configure SSH version 2, issue the ip ssh version 2 global configuration mode command. Generating an RSA key pair automatically enables SSH. Use the crypto key generate rsa global configuration mode command to enable the SSH server on the switch and generate an RSA key pair. When generating RSA keys, the administrator is prompted to enter a modulus length. The sample configuration in the figure uses a modulus size of 1,024 bits. A longer modulus length is more secure, but it takes longer to generate and to use.
        <br>Note: To delete the RSA key pair, use the crypto key zeroize rsa global configuration mode command. After the RSA key pair is deleted, the SSH server is automatically disabled.</p>
        <h4>S1(config)# crypto key generate rsa <br>
        How many bits in the modulus [512]: 1024</h4>`,
    4: `<h3>Step 4 <br> Configure user authentication.</h3>
        <p>The SSH server can authenticate users locally or using an authentication server. To use the local authentication method, create a username and password pair using the username username secret password global configuration mode command. In the example, the user admin is assigned the password ccna.</p>
        <h4>S1(config)# username admin secret ccna</h4>`,
    5: `<h3>Step 5 <br> Configure the vty lines.</h3>
        <p>Enable the SSH protocol on the vty lines by using the transport input ssh line configuration mode command. The Catalyst 2960 has vty lines ranging from 0 to 15. This configuration prevents non-SSH (such as Telnet) connections and limits the switch to accept only SSH connections. Use the line vty global configuration mode command and then the login local line configuration mode command to require local authentication for SSH connections from the local username database.</p>
        <h4>S1(config)# line vty 0 15
        <br> S1(config-line)# transport input ssh
        <br> S1(config-line)# login local
        <br> S1(config-line)# exit</h4>`,
    6: `<h3>Step 6
        <br>Enable SSH version 2.</h3>
        <p>By default, SSH supports both versions 1 and 2. When supporting both versions, this is shown in the show ip ssh output as supporting version 2. Enable SSH version using the ip ssh version 2 global configuration command.</p>
        <h4>S1(config)# ip ssh version 2</h4>`,
  };
  switch (number) {
    case 1:
      document.getElementById('ssh').innerHTML = content[1];
      break;
    case 2:
      document.getElementById('ssh').innerHTML = content[2];
      break;
    case 3:
      document.getElementById('ssh').innerHTML = content[3];
      break;
    case 4:
      document.getElementById('ssh').innerHTML = content[4];
      break;
    case 5:
      document.getElementById('ssh').innerHTML = content[5];
      break;
    case 6:
      document.getElementById('ssh').innerHTML = content[6];
      break;
  }
}
function filterShow(number) {
  const content = {
    1: `<h3>section</h3>
        <p>Shows the entire section that starts with the filtering expression, as shown in the example.</p>
        <h4>
          <br>R1# show running-config | section line vty
          <br>line vty 0 4
          <br>password 7 110A1016141D
          <br>&nbsp;&nbsp;login
          <br>&nbsp;&nbsp;transport input all
        </h4>`,
    2: `<h3>include</h3>
        <p>Includes all output lines that match the filtering expression, as shown in the example.</p>
        <h4>
          R1# show ip interface brief
          <br>Interface______________IP-Address______OK? Method Status                Protocol
          <br>GigabitEthernet0/0/0___192.168.10.1____YES manual up                    up
          <br>GigabitEthernet0/0/1___192.168.11.1____YES manual up                    up
          <br>Serial0/1/0____________209.165.200.225_YES manual up                    up
          <br>Serial0/1/1____________unassigned______NO  unset  down                  down
          <br>R1#
          <br>R1# show ip interface brief | include up
          <br>GigabitEthernet0/0/0___192.168.10.1____YES manual up                    up
          <br>GigabitEthernet0/0/1___192.168.11.1____YES manual up                    up
          <br>Serial0/1/0____________209.165.200.225 YES manual up                    up
        </h4>`,
    3: `<h3>exclude</h3>
        <p>Excludes all output lines that match the filtering expression, as shown in the example.</p>
        <h4>
          R1# show ip interface brief
          <br>Interface______________IP-Address______OK? Method Status________________Protocol
          <br>GigabitEthernet0/0/0___192.168.10.1____YES manual_up____________________up
          <br>GigabitEthernet0/0/1___192.168.11.1____YES manual_up____________________up
          <br>Serial0/1/0____________209.165.200.225_YES manual_up____________________up
          <br>Serial0/1/1____________unassigned______NO  unset__down__________________down
          <br>R1#
          <br>R1# show ip interface brief | exclude unassigned
          <br>Interface______________IP-Address______OK? Method Status_______________Protocol
          <br>GigabitEthernet0/0/0___192.168.10.1____YES manual up____________________up
          <br>GigabitEthernet0/0/1___192.168.11.1____YES manual up____________________up
          <br>Serial0/1/0____________209.165.200.225_YES manual up____________________up                   up
        </h4>`,
    4: `<h3>begin</h3>
        <p>Shows all the output lines from a certain point, starting with the line that matches the filtering expression, as shown in the example.</p>
        <h4>
          R1# show ip route | begin Gateway
          <br>Gateway of last resort is not set
          <br>192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks
          <br>C________192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
          <br>L________192.168.10.1/32 is directly connected, GigabitEthernet0/0/0
          <br>______192.168.11.0/24 is variably subnetted, 2 subnets, 2 masks
          <br>C________192.168.11.0/24 is directly connected, GigabitEthernet0/0/1
          <br>L________192.168.11.1/32 is directly connected, GigabitEthernet0/0/1
          <br>______209.165.200.0/24 is variably subnetted, 2 subnets, 2 masks
          <br>C________209.165.200.224/30 is directly connected, Serial0/1/0
          <br>L________209.165.200.225/32 is directly connected, Serial0/1/0                  up                   up
        </h4>`,
  };
  if (number == 1) {
    document.getElementById('filter').innerHTML = content[1];
  } else if (number ==2) {
    document.getElementById('filter').innerHTML = content[2];
  } else if (number ==3) {
    document.getElementById('filter').innerHTML = content[3];
  } else {
    document.getElementById('filter').innerHTML = content[4];
  }
}